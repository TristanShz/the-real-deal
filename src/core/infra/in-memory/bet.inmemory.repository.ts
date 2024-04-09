import { BetRepository } from 'src/core/application/bet.repository';
import { Bet } from 'src/core/domain/bet';

export class InMemoryBetRepository implements BetRepository {
  bets: Bet[] = [];

  async save(bet: Bet): Promise<void> {
    this.bets.push(bet);
  }

  async findById(id: string): Promise<Bet | undefined> {
    return this.bets.find((bet) => bet.id === id);
  }

  async findAll(): Promise<Bet[]> {
    return this.bets;
  }
}
