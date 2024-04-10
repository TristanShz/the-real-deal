import { RegisterCommand } from 'src/core/application/use-cases/register/register.command';
import { RegisterUseCase } from 'src/core/application/use-cases/register/register.usecase';
import { User } from 'src/core/domain/user';
import { InMemoryUserRepository } from 'src/core/infra/in-memory/user.inmemory.repository';
import { StubIdProvider } from 'src/core/infra/stub-id-provider';
import { StubPasswordHelper } from 'src/core/infra/stub-password-helper';
import { expect, expectTypeOf } from 'vitest';

export const createUserFixture = () => {
  const idProvider = new StubIdProvider();
  const passwordHelper = new StubPasswordHelper();
  const userRepository = new InMemoryUserRepository();
  const registerUseCase = new RegisterUseCase(
    userRepository,
    passwordHelper,
    idProvider,
  );

  let thrownError: any;
  return {
    givenPredefinedId(id: string) {
      idProvider.id = id;
    },
    async whenTheUserRegisters(command: RegisterCommand) {
      const result = await registerUseCase.execute(command);
      console.log(result);

      if (result.isErr()) {
        thrownError = result.error;
      }
    },
    async thenUserShouldBeRegistered(user: User) {
      const registeredUser = await userRepository.findById(user.id);

      expect(registeredUser).toEqual(user);
    },

    thenErrorShouldBe(error: any) {
      expectTypeOf(error).toEqualTypeOf(thrownError);
    },
  };
};

export type UserFixture = ReturnType<typeof createUserFixture>;
