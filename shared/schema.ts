import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  playerMove: text("player_move").notNull(), // R, P, S
  botMove: text("bot_move").notNull(),     // R, P, S
  result: text("result").notNull(),        // win, loss, tie
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({ 
  id: true, 
  createdAt: true 
});

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;

export type Move = "R" | "P" | "S";
export type GameOutcome = "win" | "loss" | "tie";

export interface PlayRequest {
  move: Move;
}

export interface PlayResponse {
  playerMove: Move;
  botMove: Move;
  result: GameOutcome;
  stats: {
    wins: number;
    losses: number;
    ties: number;
    total: number;
    winRate: number;
  };
}

export interface ResetResponse {
  success: boolean;
}
