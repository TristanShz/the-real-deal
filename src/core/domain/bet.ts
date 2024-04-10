import {
  InvalidAmountError,
  MatchAlreadyStartedError,
  MatchEndedError,
} from '../application/use-cases/make-a-bet/make-a-bet.errors';
import { AggregateRoot } from '../common/aggregate-root';
import { Match, MatchResult } from './match';
import { InsufficientBalanceError, User } from './user';

interface BetProps {
  id: string;
  amount: number;
  match: Match;
  user: User;
  expectedResult: MatchResult;
  odds?: number;
}

interface BetData {
  id: string;
  amount: number;
  match: Match;
  user: User;
  expectedResult: MatchResult;
  odds?: number;
}

export class Bet extends AggregateRoot<BetProps, string> {
  constructor(props: BetProps) {
    super(props);
    this.validate();
  }

  get odds() {
    return (
      this._props.odds ??
      this._props.match.averageOdds(this._props.expectedResult)
    );
  }

  get data(): BetData {
    return {
      id: this._props.id,
      amount: this._props.amount,
      match: this._props.match,
      user: this._props.user,
      expectedResult: this._props.expectedResult,
      odds: this.odds,
    };
  }

  make() {
    if (this._props.user.balance < this._props.amount) {
      throw new InsufficientBalanceError();
    }
    this._props.user.debit(this._props.amount);
  }

  static fromData(data: BetData) {
    return new Bet({
      id: data.id,
      amount: data.amount,
      match: data.match,
      user: data.user,
      expectedResult: data.expectedResult,
      odds: data.odds,
    });
  }

  private validate() {
    if (this._props.match.status === 'STARTED') {
      throw new MatchAlreadyStartedError();
    }

    if (this._props.match.status === 'ENDED') {
      throw new MatchEndedError();
    }

    if (this._props.amount <= 0) {
      throw new InvalidAmountError();
    }
  }
}
