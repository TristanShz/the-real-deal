import { Match } from 'src/core/domain/match';

export class MatchMap {
  static toDomain(raw: any) {
    return Match.fromData({
      id: raw.id,
      status: raw.status,
      odds: raw.odds,
    });
  }

  static toPersistence(match: Match) {
    return {
      id: match.id,
      status: match.status,
      odds: match.odds.map((odd) => odd.id),
    };
  }
}
