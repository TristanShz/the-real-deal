import { Bet } from '../domain/bet';

export interface BetRepository {
  save(bet: Bet): Promise<void>;
  findById(id: number): Promise<Bet | undefined>;
}
