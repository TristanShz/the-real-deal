import { Entity } from '../common/entity';
import { MatchResult } from './match';

interface BetProps {
  id: string;
  amount: number;
  odds: number;
  matchId: string;
  userId: string;
  expectedResult: MatchResult;
}

export class InvalidAmountError extends Error {}

export class Bet extends Entity<BetProps, string> {
  constructor(props: BetProps) {
    super(props);
    this.validate();
  }

  get data() {
    return {
      id: this._props.id,
      amount: this._props.amount,
      odds: this._props.odds,
      matchId: this._props.matchId,
      userId: this._props.userId,
      expectedResult: this._props.expectedResult,
    };
  }

  static fromData(data: Bet['data']) {
    return new Bet({
      id: data.id,
      amount: data.amount,
      odds: data.odds,
      matchId: data.matchId,
      userId: data.userId,
      expectedResult: data.expectedResult,
    });
  }

  private validate() {
    if (this._props.amount <= 0) {
      throw new InvalidAmountError();
    }
  }
}
