import { z } from 'zod';
import { Entity } from '../common/entity';
import { EntityValidationError } from '../common/errors';
import { MatchResult } from './match';

const OddsPropsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  matchId: z.string(),
  teamOne: z.number(),
  teamTwo: z.number(),
  draw: z.number(),
});

export interface OddsData {
  id: string;
  userId: string;
  matchId: string;
  teamOne: number;
  teamTwo: number;
  draw: number;
}

export type OddsProps = z.infer<typeof OddsPropsSchema>;

export class Odds extends Entity<OddsProps, string> {
  constructor(props: OddsProps) {
    super(props);

    this.validateProps(props);
  }

  valueForResult(result: MatchResult) {
    switch (result) {
      case 'ONE':
        return this._props.teamOne;
      case 'TWO':
        return this._props.teamTwo;
      case 'X':
        return this._props.draw;
      default:
        throw new Error('Invalid match result');
    }
  }

  get data(): OddsData {
    return {
      id: this._props.id,
      userId: this._props.userId,
      matchId: this._props.matchId,
      teamOne: this._props.teamOne,
      teamTwo: this._props.teamTwo,
      draw: this._props.draw,
    };
  }

  static fromData(data: OddsData) {
    return new Odds(data);
  }

  private validateProps(props: OddsProps) {
    const result = OddsPropsSchema.safeParse(props);
    if (!result.success) {
      throw new EntityValidationError(result.error.errors);
    }
  }
}
