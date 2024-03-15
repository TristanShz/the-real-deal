import { Err, Ok } from '../../common/result';
import { Result, Bet } from '../../domain/bet';
import { BetRepository } from '../bet.repository';
import { MatchRepository } from '../match.repository';
import { UserRepository } from '../user.repository';

export interface MakeABetCommand {
  id: number;
  amount: number;
  odds: number;
  result: Result;
  matchId: number;
  userId: number;
}

export class MatchAlreadyStartedError extends Error {}
export class MatchNotFoundError extends Error {}
export class MatchEndedError extends Error {}
export class InsufficientBalanceError extends Error {}

export class MakeABetUseCase {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly matchRepository: MatchRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: MakeABetCommand) {
    try {
      const match = await this.matchRepository.findById(command.matchId);
      const user = await this.userRepository.findById(command.userId);

      if (!match) {
        throw new MatchNotFoundError();
      }

      if (match.status === 'STARTED') {
        throw new MatchAlreadyStartedError();
      }

      if (match.status === 'ENDED') {
        throw new MatchEndedError();
      }

      if (user.balance < command.amount) {
        throw new InsufficientBalanceError();
      }

      const bet = new Bet(command);

      await this.betRepository.save(bet);

      return Ok.of(undefined);
    } catch (e) {
      return Err.of(e);
    }
  }
}
