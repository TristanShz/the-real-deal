import { MATCH_RESULTS } from 'src/core/domain/match';
import { z } from 'zod';

export const MakeABetCommandSchema = z.object({
  id: z.string(),
  amount: z.number(),
  expectedResult: z.enum(MATCH_RESULTS),
  matchId: z.string(),
  userId: z.string(),
});

export type MakeABetCommand = z.infer<typeof MakeABetCommandSchema>;
