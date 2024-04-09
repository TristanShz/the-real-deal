import { Injectable } from '@nestjs/common';
import { Match } from '../domain/match';

@Injectable()
export abstract class MatchRepository {
  abstract findById(id: string): Promise<Match | undefined>;
}
