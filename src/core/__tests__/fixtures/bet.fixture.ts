import { MakeABetCommand } from 'src/core/application/use-cases/make-a-bet/make-a-bet.command';
import { MakeABetUseCase } from 'src/core/application/use-cases/make-a-bet/make-a-bet.usecase';
import { Bet } from 'src/core/domain/bet';
import { Match } from 'src/core/domain/match';
import { User } from 'src/core/domain/user';
import { InMemoryBetRepository } from 'src/core/infra/in-memory/bet.inmemory.repository';
import { InMemoryMatchRepository } from 'src/core/infra/in-memory/match.inmemory.repository';
import { InMemoryUserRepository } from 'src/core/infra/in-memory/user.inmemory.repository';
import { expect } from 'vitest';

export const createBetFixture = () => {
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
    thrownError,
    givenSomeMatchesExist: (matches: Match[]) => {
      matchRepository.givenSomeMatchesExist(matches);
    },
    givenSomeUsersExists: (users: User[]) => {
      userRepository.givenSomeUsersExist(users);
    },
    whenTheUserMakesABet: async (command: MakeABetCommand) => {
      const result = await makeABetUseCase.execute(command);

      console.log('RESULT : : ', result);

      if (result.isErr()) {
        thrownError = result.error;
      }
    },
    thenBetShouldBe: async (expectedBet: Bet) => {
      const bet = await betRepository.findById(expectedBet.id);
      expect(bet).toEqual(expectedBet);
    },

    thenBetsShouldContain: async (expectedBets: Bet[]) => {
      const bets = await betRepository.findAll();
      expect(bets).toEqual(expect.arrayContaining(expectedBets));
    },

    thenErrorShouldBe: (expectedError: any) => {
      expect(thrownError).toEqual(expectedError);
    },
  };
};

export type BetFixture = ReturnType<typeof createBetFixture>;
