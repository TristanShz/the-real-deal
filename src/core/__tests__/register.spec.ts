import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest';
import { StubIdProvider } from '../infra/stub-id-provider';
import { StubPasswordHelper } from '../infra/stub-password-helper';
import { RegisterUsecase } from '../application/use-cases/register/register.usecase';
import { InMemoryUserRepository } from '../infra/in-memory/user.inmemory.repository';
import { RegisterCommand } from '../application/use-cases/register/register.command';
import { InvalidPasswordError, User } from '../domain/user';
import { EntityValidationError } from '../common/errors';

describe('Feature: Register', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  describe('Rule: The user must provide a valid email', () => {
    test('The use can register with a valid email', async () => {
      fixture.givenPredefinedId('id-1');

      await fixture.whenTheUserRegisters({
        username: 'John',
        email: 'johndoe@gmail.com',
        password: 'qwerty123',
      });

      await fixture.thenUserShouldBeRegistered(
        User.fromData({
          id: 'id-1',
          username: 'John',
          email: 'johndoe@gmail.com',
        }),
      );
    });
    test('The user cannot register with an invalid email', async () => {
      await fixture.whenTheUserRegisters({
        username: 'John',
        email: 'invalid-email',
        password: 'qwerty123',
      });

      fixture.thenErrorShouldBe(EntityValidationError);
    });
  });

  describe("Rule: The user's password must be strong", () => {
    test("The user can't register with a password less than 8 characters", async () => {
      await fixture.whenTheUserRegisters({
        username: 'John',
        email: 'johndoe@gmail.com',
        password: '1234567',
      });

      fixture.thenErrorShouldBe(InvalidPasswordError);
    });
  });
});

const createUserFixture = () => {
  const idProvider = new StubIdProvider();
  const passwordHelper = new StubPasswordHelper();
  const userRepository = new InMemoryUserRepository();
  const registerUseCase = new RegisterUsecase(
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
