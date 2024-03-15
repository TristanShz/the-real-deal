import {
  InsufficientBalanceError,
  MakeABetCommand,
  MakeABetUseCase,
  MatchAlreadyStartedError,
  MatchEndedError,
} from '../application/use-cases/make-a-bet.usecase';
import { Bet, InvalidAmountError } from '../domain/bet';
import { Match } from '../domain/match';
import { User } from '../domain/user';
import { InMemoryBetRepository } from '../infra/in-memory/bet.inmemory.repository';
import { InMemoryMatchRepository } from '../infra/in-memory/match.inmemory.repository';
import { InMemoryUserRepository } from '../infra/in-memory/user.inmemory.repository';

describe('Feature: Make a Bet', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: You can't bet on a game that's already started", () => {
    test('The user can bet on a match before it start', async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'UPCOMING' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 100,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      await fixture.thenTheBetShouldBe(
        new Bet({
          id: 1,
          amount: 100,
          odds: 1.5,
          result: '1',
          matchId: 1,
          userId: 1,
        }),
      );
    });

    test("The user can't bet on a match after it start", async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'STARTED' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 100,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      fixture.thenErrorShouldBe(MatchAlreadyStartedError);
    });
  });

  describe("Rule: You can't bet on a game that's ended", () => {
    test("The user can't bet on a match after it end", async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'ENDED' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 100,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      fixture.thenErrorShouldBe(MatchEndedError);
    });
  });

  describe("Rule: You can't bet with a negative amount", () => {
    test("The user can't bet with a negative amount", async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'UPCOMING' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: -1,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      fixture.thenErrorShouldBe(InvalidAmountError);
    });

    test("The user can't bet with a null amount", async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'UPCOMING' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 0,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      fixture.thenErrorShouldBe(InvalidAmountError);
    });

    test("The user can't bet with an amount greater than his balance", async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'UPCOMING' })]);

      fixture.givenSomeUsersExists([
        new User({
          id: 1,
          balance: 100,
        }),
      ]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 101,
        odds: 1.5,
        result: '1',
        matchId: 1,
        userId: 1,
      });

      fixture.thenErrorShouldBe(InsufficientBalanceError);
    });
  });
});

const createFixture = () => {
  const betRepository = new InMemoryBetRepository();
  const matchRepository = new InMemoryMatchRepository();
  const userRepository = new InMemoryUserRepository();
  const makeABetUseCase = new MakeABetUseCase(
    betRepository,
    matchRepository,
    userRepository,
  );

  let thrownError: Error | undefined;
  return {
    givenSomeMatchesExist: (matches: Match[]) => {
      matchRepository.givenSomeMatchesExist(matches);
    },
    givenSomeUsersExists: (users: User[]) => {
      userRepository.givenSomeUsersExist(users);
    },
    whenTheUserMakesABet: async (command: MakeABetCommand) => {
      const result = await makeABetUseCase.execute(command);

      if (result.isErr()) {
        thrownError = result.error;
      }
    },
    thenTheBetShouldBe: async (expectedBet: Bet) => {
      const bet = await betRepository.findById(expectedBet.id);
      expect(bet).toEqual(expectedBet);
    },
    thenErrorShouldBe: (expectedError: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
