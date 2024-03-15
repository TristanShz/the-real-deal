import {
  MakeABetCommand,
  MakeABetUseCase,
  MatchAlreadyStartedError,
} from '../application/use-cases/make-a-bet.usecase';
import { Bet } from '../domain/bet';
import { Match } from '../domain/match';
import { InMemoryBetRepository } from '../infra/in-memory/bet.inmemory.repository';
import { InMemoryMatchRepository } from '../infra/in-memory/match.inmemory.repository';

describe('Feature: Make a Bet', () => {
  describe("Rule: You can't bet on a game that's already started", () => {
    let fixture: Fixture;

    beforeEach(() => {
      fixture = createFixture();
    });

    test('The user can bet on a match before it start', async () => {
      fixture.givenSomeMatchesExist([new Match({ id: 1, status: 'UPCOMING' })]);

      await fixture.whenTheUserMakesABet({
        id: 1,
        amount: 100,
        odds: 1.5,
        result: '1',
        matchId: 1,
      });

      await fixture.thenTheBetShouldBe(
        new Bet({ id: 1, amount: 100, odds: 1.5, result: '1', matchId: 1 }),
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
      });

      fixture.thenErrorShouldBe(MatchAlreadyStartedError);
    });
  });
});

const createFixture = () => {
  const betRepository = new InMemoryBetRepository();
  const matchRepository = new InMemoryMatchRepository();
  const makeABetUseCase = new MakeABetUseCase(betRepository, matchRepository);

  let thrownError: Error | undefined;
  return {
    givenSomeMatchesExist: (matches: Match[]) => {
      matchRepository.givenSomeMatchesExist(matches);
    },
    whenTheUserMakesABet: async (command: MakeABetCommand) => {
      const result = await makeABetUseCase.execute(command);

      console.log(result);
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
