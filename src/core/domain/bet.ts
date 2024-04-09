import { Entity } from '../common/entity';

interface BetProps {
  id: string;
  amount: number;
  odds: number;
  matchId: string;
  userId: string;
  value: string;
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
      value: this._props.value,
    };
  }

  static fromData(data: Bet['data']) {
    return new Bet({
      id: data.id,
      amount: data.amount,
      odds: data.odds,
      matchId: data.matchId,
      userId: data.userId,
      value: data.value,
    });
  }

  private validate() {
    if (this._props.amount <= 0) {
      throw new InvalidAmountError();
    }
  }
}
