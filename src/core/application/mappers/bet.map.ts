import { Bet } from 'src/core/domain/bet';
import { UserMap } from './user.map';
import { MatchMap } from './match.map';

export class BetMap {
  static toDomain(raw: any): Bet {
    return Bet.fromData({
      id: raw.id,
      amount: raw.amount,
      odds: raw.odds,
      expectedResult: raw.expectedResult,
      user: UserMap.toDomain(raw.user),
      match: MatchMap.toDomain(raw.match),
    });
  }

  static toPersistence(bet: Bet) {
    return {
      id: bet.id,
      amount: bet.amount,
      odds: bet.odds,
      expectedResult: bet.expectedResult,
    };
  }
}
