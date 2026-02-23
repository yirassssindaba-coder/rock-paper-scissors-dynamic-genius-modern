import { z } from 'zod';

export const api = {
  game: {
    play: {
      method: 'POST' as const,
      path: '/api/play',
      input: z.object({
        move: z.enum(['R', 'P', 'S']),
      }),
      responses: {
        200: z.object({
          playerMove: z.enum(['R', 'P', 'S']),
          botMove: z.enum(['R', 'P', 'S']),
          result: z.enum(['win', 'loss', 'tie']),
          stats: z.object({
            wins: z.number(),
            losses: z.number(),
            ties: z.number(),
            total: z.number(),
            winRate: z.number(),
          }),
        }),
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/reset',
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
