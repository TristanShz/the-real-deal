import { Entity } from '../common/entity';
import { Odds } from './odds';

export const MATCH_STATUS = ['UPCOMING', 'STARTED', 'ENDED'] as const;
export type MatchStatus = (typeof MATCH_STATUS)[number];

export const MATCH_RESULTS = ['ONE', 'X', 'TWO'] as const;
export type MatchResult = (typeof MATCH_RESULTS)[number];

export interface MatchProps {
  id: string;
  status: MatchStatus;
  odds?: Odds[];
}

export class Match extends Entity<MatchProps, string> {
  constructor(props: MatchProps) {
    super(props);
  }

  get status() {
    return this._props.status;
  }

  get odds() {
    return this._props.odds || [];
  }

  get data() {
    return {
      id: this._props.id,
      status: this._props.status,
      odds: this.odds,
    };
  }

  averageOdds(result: MatchResult): number {
    if (!this.odds.length) {
      return 0;
    }

    let sum = 0;

    this.odds.forEach((odd) => {
      sum += odd.valueForResult(result);
    });

    return parseInt((sum / this.odds.length).toFixed(2));
  }

  static fromData(data: Match['data']) {
    return new Match(data);
  }
}
