import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoreModule } from './core';
import { PrismaService } from './core/infra/prisma/prisma.service';
import { PrismaUserRepository } from './core/infra/prisma/user.prisma.repository';
import { PrismaMatchRepository } from './core/infra/prisma/match.prisma.repository';
import { PrismaBetRepository } from './core/infra/prisma/bet.prisma.repository';
import { RealIdProvider } from './core/infra/real-id-provider';
import { RealPasswordHelper } from './core/infra/real-password-helper';

@Module({
  imports: [
    CoreModule.register({
      BetRepository: PrismaBetRepository,
      UserRepository: PrismaUserRepository,
      MatchRepository: PrismaMatchRepository,
      PrismaClient: PrismaService,
      IdProvider: RealIdProvider,
      PasswordHelper: RealPasswordHelper,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
