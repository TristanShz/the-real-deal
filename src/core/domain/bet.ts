import { Entity } from '../common/entity';

interface BetProps {
  id: number;
  amount: number;
  odds: number;
  result: Result;
  matchId: number;
  userId: number;
}

const RESULT_VALUES = ['1', 'X', '2'] as const;
export type Result = (typeof RESULT_VALUES)[number];

export class InvalidAmountError extends Error {}

export class Bet extends Entity<BetProps, number> {
  constructor(props: BetProps) {
    super(props);
    this.validate();
  }

  private validate() {
    if (this._props.amount <= 0) {
      throw new InvalidAmountError();
    }
  }
}
