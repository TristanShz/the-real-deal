import { userBuilder } from 'src/core/__tests__/builders/user.builder';
import {
  BetFixture,
  createBetFixture,
} from 'src/core/__tests__/fixtures/bet.fixture';
import { Bet } from 'src/core/domain/bet';
import { Match } from 'src/core/domain/match';
import { InsufficientBalanceError } from 'src/core/domain/user';
import { describe, test, beforeEach } from 'vitest';
import { MakeABetCommand } from './make-a-bet.command';
import {
  MatchNotFoundError,
  UserNotFoundError,
  MatchAlreadyStartedError,
  MatchEndedError,
  InvalidAmountError,
} from './make-a-bet.errors';

const defaultBetCommand: MakeABetCommand = {
  id: 'id-1',
  amount: 100,
  expectedResult: 'ONE',
  matchId: 'id-1',
  userId: 'id-1',
};

const testMatch = new Match({ id: 'id-1', status: 'UPCOMING' });
const testUser = userBuilder().withId('id-1').build();
const defaultBet = new Bet({
  id: 'id-1',
  amount: 100,
  odds: 1.5,
  expectedResult: 'ONE',
  user: testUser,
  match: testMatch,
});

describe('Feature: Make a Bet', () => {
  let fixture: BetFixture;

  beforeEach(() => {
    fixture = createBetFixture();
  });

  describe("Rule: You can't bet on a game that's already started", () => {
    test('The match must exist', async () => {
      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenErrorShouldBe(new MatchNotFoundError());
    });
    test('The user must exist', async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);
      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenErrorShouldBe(new UserNotFoundError());
    });

    test('The user can bet on a match before it start', async () => {
      const user = userBuilder().withId('user-1').withBalance(150).build();
      const match = new Match({ id: 'match-1', status: 'UPCOMING' });
      fixture.givenSomeUsersExists([user]);
      fixture.givenSomeMatchesExist([match]);

      await fixture.whenTheUserMakesABet({
        id: 'bet-1',
        amount: 100,
        expectedResult: 'ONE',
        matchId: 'match-1',
        userId: 'user-1',
      });

      console.log('BALANCE ::: ', user.balance);
      await fixture.thenBetShouldBe(
        Bet.fromData({
          id: 'bet-1',
          amount: 100,
          expectedResult: 'ONE',
          match,
          user,
        }),
      );
    });

    test("The user can't bet on a match after it start", async () => {
      fixture.givenSomeUsersExists([userBuilder().withId('id-1').build()]);
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'STARTED' }),
      ]);

      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenErrorShouldBe(new MatchAlreadyStartedError());
    });
  });

  describe("Rule: You can't bet on a game that's ended", () => {
    test("The user can't bet on a match after it end", async () => {
      fixture.givenSomeUsersExists([userBuilder().withId('id-1').build()]);
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'ENDED' }),
      ]);

      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenErrorShouldBe(new MatchEndedError());
    });
  });

  describe("Rule: You can't bet with a negative amount", () => {
    test('The user can bet with a valid amount', async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);
      fixture.givenSomeUsersExists([
        userBuilder().withId('id-1').withBalance(100).build(),
      ]);

      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenBetShouldBe(defaultBet);
    });

    test("The user can't bet with a negative amount", async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);
      fixture.givenSomeUsersExists([userBuilder().withId('id-1').build()]);

      await fixture.whenTheUserMakesABet({
        id: 'id-1',
        amount: -1,
        expectedResult: 'ONE',
        matchId: 'id-1',
        userId: 'id-1',
      });

      fixture.thenErrorShouldBe(new InvalidAmountError());
    });

    test("The user can't bet with a null amount", async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);
      fixture.givenSomeUsersExists([
        userBuilder().withId('id-1').withBalance(100).build(),
      ]);

      await fixture.whenTheUserMakesABet({
        id: 'id-1',
        amount: 0,
        expectedResult: 'ONE',
        matchId: 'id-1',
        userId: 'id-1',
      });

      fixture.thenErrorShouldBe(new InvalidAmountError());
    });

    test("The user can't bet with an amount greater than his balance", async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);

      fixture.givenSomeUsersExists([
        userBuilder().withId('id-1').withBalance(100).build(),
      ]);

      await fixture.whenTheUserMakesABet({
        id: 'id-1',
        amount: 101,
        expectedResult: 'ONE',
        matchId: 'id-1',
        userId: 'id-1',
      });

      fixture.thenErrorShouldBe(new InsufficientBalanceError());
    });
  });

  describe('Rule: The user can make several bets on same match', () => {
    test('The user make a second bet on a match', async () => {
      const user = userBuilder().withId('id-1').withBalance(100).build();
      const match = new Match({ id: 'id-1', status: 'UPCOMING' });

      fixture.givenSomeUsersExists([user]);
      fixture.givenSomeMatchesExist([match]);

      await fixture.whenTheUserMakesABet({
        id: 'id-1',
        amount: 40,
        expectedResult: 'TWO',
        matchId: 'id-1',
        userId: 'id-1',
      });
      await fixture.whenTheUserMakesABet({
        id: 'id-2',
        amount: 60,
        expectedResult: 'X',
        matchId: 'id-1',
        userId: 'id-1',
      });

      await fixture.thenBetsShouldContain([
        new Bet({
          id: 'id-1',
          amount: 40,
          expectedResult: 'TWO',
          match,
          user,
        }),
        new Bet({
          id: 'id-2',
          amount: 60,
          expectedResult: 'X',
          match,
          user,
        }),
      ]);
    });
  });

  describe("Rule: The user's balance must be updated after a bet", () => {
    test("The user's balance is updated after a bet", async () => {
      const user = userBuilder().withId('user-1').withBalance(100).build();
      const match = new Match({ id: 'match-1', status: 'UPCOMING' });
      fixture.givenSomeUsersExists([user]);
      fixture.givenSomeMatchesExist([match]);
      await fixture.whenTheUserMakesABet({
        id: 'bet-1',
        amount: 40,
        expectedResult: 'TWO',
        matchId: 'match-1',
        userId: 'user-1',
      });
      await fixture.thenUserShouldHaveBalance(60, 'user-1');
    });
  });
});
