import { Entity } from '../common/entity';

interface BetProps {
  id: number;
  amount: number;
  odds: number;
  result: Result;
  matchId: number;
}

const RESULT_VALUES = ['1', 'X', '2'] as const;
export type Result = (typeof RESULT_VALUES)[number];

export class Bet extends Entity<BetProps, number> {
  constructor(props: BetProps) {
    super(props);
  }
}
