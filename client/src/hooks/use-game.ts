import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PlayResponse, type PlayRequest, type ResetResponse } from "@shared/routes";

export function usePlayGame() {
  return useMutation({
    mutationFn: async (move: PlayRequest['move']) => {
      const payload = { move };
      // Runtime check to match schema manually if needed, 
      // but api object gives us validation on backend. 
      // We assume correct input from frontend type safety.
      
      const res = await fetch(api.game.play.path, {
        method: api.game.play.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to play move");
      }

      // Parse with Zod schema from shared routes for type safety
      return api.game.play.responses[200].parse(await res.json());
    },
  });
}

export function useResetGame() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.game.reset.path, {
        method: api.game.reset.method,
      });

      if (!res.ok) {
        throw new Error("Failed to reset game");
      }

      return api.game.reset.responses[200].parse(await res.json());
    },
  });
}
