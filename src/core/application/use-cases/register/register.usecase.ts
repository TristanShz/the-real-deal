import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../ports/user.repository';
import { RegisterCommand } from './register.command';
import { IdProvider } from '../../ports/id-provider';
import { User } from 'src/core/domain/user';
import { Err, Ok } from 'src/core/common/result';
import { PasswordHelper } from '../../ports/password-helper';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHelper: PasswordHelper,
    private readonly idProvider: IdProvider,
  ) {}

  async execute(command: RegisterCommand) {
    try {
      User.validatePassword(command.password);
      const password = this.passwordHelper.hash(command.password);
      const id = this.idProvider.generate();

      const user = User.fromData({
        id,
        username: command.username,
        email: command.email,
      });

      await this.userRepository.register(user, password);

      return Ok.of(undefined);
    } catch (e) {
      return Err.of(e);
    }
  }
}
