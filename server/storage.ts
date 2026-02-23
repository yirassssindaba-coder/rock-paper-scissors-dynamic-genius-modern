import { db } from "./db";
import {
  gameResults,
  type InsertGameResult,
  type GameResult,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  createGameResult(result: InsertGameResult): Promise<GameResult>;
  getStats(sessionId: string): Promise<{
    wins: number;
    losses: number;
    ties: number;
    total: number;
  }>;
  clearSession(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createGameResult(result: InsertGameResult): Promise<GameResult> {
    const [saved] = await db.insert(gameResults).values(result).returning();
    return saved;
  }

  async getStats(sessionId: string): Promise<{
    wins: number;
    losses: number;
    ties: number;
    total: number;
  }> {
    const results = await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.sessionId, sessionId));

    const wins = results.filter((r) => r.result === "win").length;
    const losses = results.filter((r) => r.result === "loss").length;
    const ties = results.filter((r) => r.result === "tie").length;

    return {
      wins,
      losses,
      ties,
      total: results.length,
    };
  }

  async clearSession(sessionId: string): Promise<void> {
    await db.delete(gameResults).where(eq(gameResults.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
