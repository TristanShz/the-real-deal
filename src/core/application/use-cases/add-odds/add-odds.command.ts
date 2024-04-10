import { z } from 'zod';

const AddOddsCommandSchema = z.object({
  userId: z.string(),
  matchId: z.string(),
  teamOne: z.number(),
  teamTwo: z.number(),
  draw: z.number(),
});

export type AddOddsCommand = z.infer<typeof AddOddsCommandSchema>;
