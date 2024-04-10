import { beforeEach, describe, test } from 'vitest';
import { InvalidPasswordError, User } from '../domain/user';
import { EntityValidationError } from '../common/errors';
import { UserFixture, createUserFixture } from './fixtures/user.fixture';

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
