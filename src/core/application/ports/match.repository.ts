import { Injectable } from '@nestjs/common';
import { Match } from 'src/core/domain/match';

@Injectable()
export abstract class MatchRepository {
  abstract findById(id: string): Promise<Match | undefined>;
}
