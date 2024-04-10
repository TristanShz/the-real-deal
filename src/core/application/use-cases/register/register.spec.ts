import {
  UserFixture,
  createUserFixture,
} from 'src/core/__tests__/fixtures/user.fixture';
import { EntityValidationError } from 'src/core/common/errors';
import { User, InvalidPasswordError } from 'src/core/domain/user';
import { beforeEach, describe, test } from 'vitest';

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
        role: 'MEMBER',
      });

      await fixture.thenUserShouldBeRegistered(
        User.fromData({
          id: 'id-1',
          username: 'John',
          email: 'johndoe@gmail.com',
          role: 'MEMBER',
        }),
      );
    });
    test('The user cannot register with an invalid email', async () => {
      await fixture.whenTheUserRegisters({
        username: 'John',
        email: 'invalid-email',
        password: 'qwerty123',
        role: 'MEMBER',
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
        role: 'MEMBER',
      });

      fixture.thenErrorShouldBe(InvalidPasswordError);
    });
  });
});
