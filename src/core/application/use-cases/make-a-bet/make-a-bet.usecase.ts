import { Injectable } from '@nestjs/common';
import { BetRepository } from '../../ports/bet.repository';
import { MatchRepository } from '../../ports/match.repository';
import { UserRepository } from '../../ports/user.repository';
import { MakeABetCommand } from './make-a-bet.command';
import { Bet } from '../../../domain/bet';
import { Err, Ok } from 'src/core/common/result';
import {
  MatchNotFoundError,
  UserNotFoundError,
  MatchAlreadyStartedError,
  MatchEndedError,
  InsufficientBalanceError,
} from './make-a-bet.errors';

@Injectable()
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

      if (!user) {
        throw new UserNotFoundError();
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
      console.log('ERROR : ', e);
      return Err.of(e);
    }
  }
}
