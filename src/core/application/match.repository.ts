import { Match } from '../domain/match';

export interface MatchRepository {
  findById(id: number): Promise<Match | undefined>;
}
