import { Entity } from '../common/entity';

export const MATCH_STATUS = ['UPCOMING', 'STARTED', 'ENDED'] as const;
export type MatchStatus = (typeof MATCH_STATUS)[number];

export interface MatchProps {
  id: number;
  status: MatchStatus;
}

export class Match extends Entity<MatchProps, number> {
  constructor(props: MatchProps) {
    super(props);
  }

  get status() {
    return this._props.status;
  }
}
