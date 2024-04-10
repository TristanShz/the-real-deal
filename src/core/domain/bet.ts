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

export class MatchNotFoundError extends Error {
  constructor() {
    super('Match not found');
  }
}

export class MatchAlreadyStartedError extends Error {
  constructor() {
    super('Match already started');
  }
}

export class MatchEndedError extends Error {
  constructor() {
    super('Match ended');
  }
}

export class InvalidAmountError extends Error {
  constructor() {
    super('Bet amount must be greater than 0');
  }
}

export class Bet extends AggregateRoot<BetProps, string> {
  constructor(props: BetProps) {
    super(props);
    this.validate();
  }

  get user() {
    return this._props.user;
  }

  get amount() {
    return this._props.amount;
  }

  get expectedResult() {
    return this._props.expectedResult;
  }

  get match() {
    return this._props.match;
  }

  get odds() {
    return (
      this._props.odds ??
      this._props.match.averageOdds(this._props.expectedResult)
    );
  }

  get data() {
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
