import { Injectable } from '@nestjs/common';
import { Odds } from 'src/core/domain/odds';

@Injectable()
export abstract class OddsRepository {
  abstract findById(id: string): Promise<Odds | undefined>;
  abstract save(odds: Odds): Promise<void>;
}
