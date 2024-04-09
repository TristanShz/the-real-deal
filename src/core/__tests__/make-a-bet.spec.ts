import { describe, test, beforeEach } from 'vitest';
import { Bet, InvalidAmountError } from '../domain/bet';
import { Match } from '../domain/match';
import { BetFixture, createBetFixture } from './fixtures/bet.fixture';
import { userBuilder } from './user.builder';
import { MakeABetCommand } from '../application/use-cases/make-a-bet/make-a-bet.command';
import {
  MatchNotFoundError,
  UserNotFoundError,
  MatchAlreadyStartedError,
  MatchEndedError,
  InsufficientBalanceError,
} from '../application/use-cases/make-a-bet/make-a-bet.errors';

const defaultBetCommand: MakeABetCommand = {
  id: 'id-1',
  amount: 100,
  odds: 1.5,
  expectedResult: 'ONE',
  matchId: 'id-1',
  userId: 'id-1',
};

const defaultBet = new Bet({
  id: 'id-1',
  amount: 100,
  odds: 1.5,
  expectedResult: 'ONE',
  matchId: 'id-1',
  userId: 'id-1',
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
      fixture.givenSomeUsersExists([userBuilder().withId('id-1').build()]);
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);

      await fixture.whenTheUserMakesABet(defaultBetCommand);

      await fixture.thenBetShouldBe(defaultBet);
    });

    test("The user can't bet on a match after it start", async () => {
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'STARTED' }),
      ]);

      await fixture.whenTheUserMakesABet(defaultBetCommand);

      fixture.thenErrorShouldBe(new MatchAlreadyStartedError());
    });
  });

  describe("Rule: You can't bet on a game that's ended", () => {
    test("The user can't bet on a match after it end", async () => {
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
        odds: 1.5,
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
        odds: 1.5,
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
        odds: 1.5,
        expectedResult: 'ONE',
        matchId: 'id-1',
        userId: 'id-1',
      });

      fixture.thenErrorShouldBe(new InsufficientBalanceError());
    });
  });

  describe('Rule: The user can make several bets on same match', () => {
    test('The user make a second bet on a match', async () => {
      fixture.givenSomeUsersExists([
        userBuilder().withId('id-1').withBalance(100).build(),
      ]);
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);

      await fixture.whenTheUserMakesABet({
        id: 'id-1',
        amount: 40,
        odds: 1.5,
        expectedResult: 'TWO',
        matchId: 'id-1',
        userId: 'id-1',
      });
      await fixture.whenTheUserMakesABet({
        id: 'id-2',
        amount: 60,
        odds: 1.5,
        expectedResult: 'X',
        matchId: 'id-1',
        userId: 'id-1',
      });

      await fixture.thenBetsShouldContain([
        new Bet({
          id: 'id-1',
          amount: 40,
          odds: 1.5,
          expectedResult: 'TWO',
          matchId: 'id-1',
          userId: 'id-1',
        }),
        new Bet({
          id: 'id-2',
          amount: 60,
          odds: 1.5,
          expectedResult: 'X',
          matchId: 'id-1',
          userId: 'id-1',
        }),
      ]);
    });
  });
});
