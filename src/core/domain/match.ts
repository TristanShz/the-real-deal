import { Entity } from '../common/entity';

export const MATCH_STATUS = ['UPCOMING', 'STARTED', 'ENDED'] as const;
export type MatchStatus = (typeof MATCH_STATUS)[number];

export const MATCH_RESULTS = ['ONE', 'X', 'TWO'] as const;
export type MatchResult = (typeof MATCH_RESULTS)[number];

export interface MatchProps {
  id: string;
  status: MatchStatus;
}

export class Match extends Entity<MatchProps, string> {
  constructor(props: MatchProps) {
    super(props);
  }

  get status() {
    return this._props.status;
  }

  get data() {
    return {
      id: this._props.id,
      status: this._props.status,
    };
  }

  static fromData(data: Match['data']) {
    return new Match(data);
  }
}
