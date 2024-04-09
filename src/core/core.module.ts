import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { BetRepository } from './application/ports/bet.repository';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './application/ports/user.repository';
import { MatchRepository } from './application/ports/match.repository';
import { IdProvider } from './application/ports/id-provider';
import { MakeABetUseCase } from './application/use-cases/make-a-bet/make-a-bet.usecase';

@Module({})
export class CoreModule {
  static register(providers: {
    BetRepository: ClassProvider<BetRepository>['useClass'];
    UserRepository: ClassProvider<UserRepository>['useClass'];
    MatchRepository: ClassProvider<MatchRepository>['useClass'];
    PrismaClient: ClassProvider<PrismaClient>['useClass'];
    IdProvider: ClassProvider<IdProvider>['useClass'];
  }): DynamicModule {
    return {
      module: CoreModule,
      providers: [
        MakeABetUseCase,
        {
          provide: BetRepository,
          useClass: providers.BetRepository,
        },
        {
          provide: PrismaClient,
          useClass: providers.PrismaClient,
        },
        {
          provide: UserRepository,
          useClass: providers.UserRepository,
        },
        {
          provide: MatchRepository,
          useClass: providers.MatchRepository,
        },
        {
          provide: IdProvider,
          useClass: providers.IdProvider,
        },
      ],
      exports: [MakeABetUseCase, IdProvider],
    };
  }
}
