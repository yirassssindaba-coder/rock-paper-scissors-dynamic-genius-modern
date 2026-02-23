import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { Move, GameOutcome } from "@shared/schema";

// --- Smart Bot Logic ---
// We'll keep a simple in-memory structure for the Markov Chain per session
// Map<sessionId, Map<sequence, Map<nextMove, count>>>
const markovChains = new Map<string, Map<string, Record<string, number>>>();
const playerHistory = new Map<string, string[]>(); // store last few moves for context

const ORDER = 3; // N-gram order (look at last 3 moves)

function getBotMove(sessionId: string): Move {
  const history = playerHistory.get(sessionId) || [];
  const chain = markovChains.get(sessionId);

  // Default to random
  const moves: Move[] = ["R", "P", "S"];
  let predictedMove: Move | null = null;

  if (history.length >= ORDER && chain) {
    const lastSequence = history.slice(-ORDER).join("");
    const nextMoveCounts = chain.get(lastSequence);

    if (nextMoveCounts) {
      // Find the most likely next move
      let maxCount = -1;
      let likelyMove = "";
      
      for (const [move, count] of Object.entries(nextMoveCounts)) {
        if (count > maxCount) {
          maxCount = count;
          likelyMove = move;
        }
      }
      
      if (likelyMove) {
        predictedMove = likelyMove as Move;
      }
    }
  }

  // If we have a prediction, counter it
  if (predictedMove) {
    if (predictedMove === "R") return "P"; // Paper beats Rock
    if (predictedMove === "P") return "S"; // Scissors beats Paper
    if (predictedMove === "S") return "R"; // Rock beats Scissors
  }

  // Fallback to random if no prediction
  return moves[Math.floor(Math.random() * moves.length)];
}

function updateBotMemory(sessionId: string, move: Move) {
  // 1. Update History
  let history = playerHistory.get(sessionId);
  if (!history) {
    history = [];
    playerHistory.set(sessionId, history);
  }
  history.push(move);
  
  // 2. Update Markov Chain
  if (history.length > ORDER) {
    let chain = markovChains.get(sessionId);
    if (!chain) {
      chain = new Map();
      markovChains.set(sessionId, chain);
    }

    // Example: History [R, P, S, R] -> Sequence "RPS" led to "R"
    // We record the sequence *prior* to the current move
    const sequence = history.slice(-(ORDER + 1), -1).join("");
    const currentMove = history[history.length - 1];

    const nextMoves = chain.get(sequence) || { R: 0, P: 0, S: 0 };
    nextMoves[currentMove] = (nextMoves[currentMove] || 0) + 1;
    chain.set(sequence, nextMoves);
  }

  // Keep history manageable? (Optional, but good for long sessions)
  // Actually, for Markov, we just need the last few for prediction, 
  // but we need the full stream to build the chain. 
  // We can keep the history array growing or truncate it if it gets huge, 
  // but for a game session, it's fine.
}

function determineWinner(player: Move, bot: Move): GameOutcome {
  if (player === bot) return "tie";
  if (
    (player === "R" && bot === "S") ||
    (player === "P" && bot === "R") ||
    (player === "S" && bot === "P")
  ) {
    return "win";
  }
  return "loss";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.game.play.path, async (req, res) => {
    const sessionId = req.sessionID; // Use Express session ID to track user
    const { move } = api.game.play.input.parse(req.body);

    // 1. Get Bot Move (Prediction)
    const botMove = getBotMove(sessionId);

    // 2. Determine Result
    const result = determineWinner(move, botMove);

    // 3. Update Bot Memory with Player's Move (for next time)
    updateBotMemory(sessionId, move);

    // 4. Save to DB
    await storage.createGameResult({
      playerMove: move,
      botMove: botMove,
      result,
      sessionId,
    });

    // 5. Get Stats
    const stats = await storage.getStats(sessionId);
    const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

    res.json({
      playerMove: move,
      botMove,
      result,
      stats: {
        ...stats,
        winRate,
      },
    });
  });

  app.post(api.game.reset.path, async (req, res) => {
    const sessionId = req.sessionID;
    
    // Clear DB stats
    await storage.clearSession(sessionId);
    
    // Clear Memory
    playerHistory.delete(sessionId);
    markovChains.delete(sessionId);

    res.json({ success: true });
  });

  return httpServer;
}
