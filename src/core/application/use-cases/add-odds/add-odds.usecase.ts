import { Odds } from 'src/core/domain/odds';
import { OddsRepository } from '../../ports/odds.repository';
import { AddOddsCommand } from './add-odds.command';
import { IdProvider } from '../../ports/id-provider';
import { Err, Ok } from 'src/core/common/result';
import { UserRepository } from '../../ports/user.repository';

export class InvalidRoleError extends Error {}

export class AddOddsUseCase {
  constructor(
    private readonly oddsRepository: OddsRepository,
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute(command: AddOddsCommand) {
    try {
      const user = await this.userRepository.findById(command.userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== 'BOOKMAKER') {
        throw new InvalidRoleError('Must be a bookmaker to add odds');
      }
      const id = this.idProvider.generate();
      const odds = Odds.fromData({ id, ...command });

      await this.oddsRepository.save(odds);

      return Ok.of(undefined);
    } catch (e) {
      return Err.of(e);
    }
  }
}
