import { Err, Ok } from '../../common/result';
import { Result, Bet } from '../../domain/bet';
import { BetRepository } from '../bet.repository';
import { MatchRepository } from '../match.repository';

export interface MakeABetCommand {
  id: number;
  amount: number;
  odds: number;
  result: Result;
  matchId: number;
}

export class MatchAlreadyStartedError extends Error {}
export class MatchNotFoundError extends Error {}

export class MakeABetUseCase {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async execute(command: MakeABetCommand) {
    const match = await this.matchRepository.findById(command.matchId);

    if (!match) {
      return Err.of(new MatchNotFoundError());
    }

    if (match.status !== 'UPCOMING') {
      return Err.of(new MatchAlreadyStartedError());
    }

    await this.betRepository.save(new Bet(command));

    return Ok.of(undefined);
  }
}
