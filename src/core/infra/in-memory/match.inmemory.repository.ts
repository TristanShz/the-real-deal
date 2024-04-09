import { MatchRepository } from '../../application/ports/match.repository';
import { Match } from '../../domain/match';

export class InMemoryMatchRepository implements MatchRepository {
  private matches: Match[] = [];
  async findById(id: string): Promise<Match | undefined> {
    return this.matches.find((match) => match.id === id);
  }

  givenSomeMatchesExist(matches: Match[]) {
    this.matches = matches;
  }
}
