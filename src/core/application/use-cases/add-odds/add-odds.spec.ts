import { userBuilder } from 'src/core/__tests__/builders/user.builder';
import { Match } from 'src/core/domain/match';
import { Odds } from 'src/core/domain/odds';
import { InMemoryMatchRepository } from 'src/core/infra/in-memory/match.inmemory.repository';
import { InMemoryOddsRepository } from 'src/core/infra/in-memory/odds.inmemory.repository';
import { InMemoryUserRepository } from 'src/core/infra/in-memory/user.inmemory.repository';
import { StubIdProvider } from 'src/core/infra/stub-id-provider';
import { beforeEach, describe, expect, test } from 'vitest';
import { AddOddsCommand } from './add-odds.command';
import { InvalidRoleError, AddOddsUseCase } from './add-odds.usecase';
import { User } from 'src/core/domain/user';

describe('Feature: Add Odds', () => {
  let fixture: OddsFixture;

  beforeEach(() => {
    fixture = createOddsFixture();
  });

  describe('Rule: The user must be a bookmaker', async () => {
    test('If the user is a bookmaker, he can add odds to defined match', async () => {
      fixture.givenPredefinedId('id-1');
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);

      fixture.givenSomeUsersExist([
        userBuilder().withId('id-1').asBookmaker().build(),
      ]);

      await fixture.whenTheUserAddsOdds({
        userId: 'id-1',
        matchId: 'id-1',
        teamOne: 1.5,
        teamTwo: 2.5,
        draw: 3.0,
      });

      await fixture.thenOddsShouldBeAdded(
        Odds.fromData({
          id: 'id-1',
          userId: 'id-1',
          matchId: 'id-1',
          teamOne: 1.5,
          teamTwo: 2.5,
          draw: 3.0,
        }),
      );
    });

    test('If the user is a not a bookmaker, he cannot add odds to defined match', async () => {
      fixture.givenPredefinedId('id-1');
      fixture.givenSomeMatchesExist([
        new Match({ id: 'id-1', status: 'UPCOMING' }),
      ]);

      fixture.givenSomeUsersExist([
        userBuilder().withId('id-1').asMember().build(),
      ]);

      await fixture.whenTheUserAddsOdds({
        userId: 'id-1',
        matchId: 'id-1',
        teamOne: 1.5,
        teamTwo: 2.5,
        draw: 3.0,
      });

      fixture.thenErrorShouldBe(InvalidRoleError);
    });
  });
});

export const createOddsFixture = () => {
  const matchRepository = new InMemoryMatchRepository();
  const userRepository = new InMemoryUserRepository();
  const oddsRepository = new InMemoryOddsRepository();
  const idProvider = new StubIdProvider();
  const addOddsUseCase = new AddOddsUseCase(
    oddsRepository,
    userRepository,
    idProvider,
  );

  let thrownError: any;
  return {
    givenPredefinedId(id: string) {
      idProvider.id = id;
    },
    givenSomeMatchesExist: (matches: Match[]) => {
      matchRepository.givenSomeMatchesExist(matches);
    },
    givenSomeUsersExist: (users: User[]) => {
      userRepository.givenSomeUsersExist(users);
    },

    async whenTheUserAddsOdds(command: AddOddsCommand) {
      const result = await addOddsUseCase.execute(command);

      if (result.isErr()) {
        thrownError = result.error;
      }
    },

    async thenOddsShouldBeAdded(odds: Odds) {
      const addedOdds = await oddsRepository.findById(odds.id);
      expect(addedOdds).toEqual(odds);
    },

    thenErrorShouldBe(error: any) {
      expect(thrownError).toBeInstanceOf(error);
    },
  };
};

export type OddsFixture = ReturnType<typeof createOddsFixture>;
