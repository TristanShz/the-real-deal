import { Injectable } from '@nestjs/common';
import { Bet } from 'src/core/domain/bet';

@Injectable()
export abstract class BetRepository {
  abstract save(bet: Bet): Promise<void>;
  abstract findById(id: string): Promise<Bet | undefined>;
  abstract findAll(): Promise<Bet[]>;
}
