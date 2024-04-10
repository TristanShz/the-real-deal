import { OddsRepository } from 'src/core/application/ports/odds.repository';
import { Odds } from 'src/core/domain/odds';

export class InMemoryOddsRepository implements OddsRepository {
  odds: Odds[] = [];

  async findById(id: string) {
    return this.odds.find((odds) => odds.id === id);
  }
  async save(odds: Odds) {
    this.odds.push(odds);
  }
}
