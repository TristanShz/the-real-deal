import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BetMap } from 'src/core/application/mappers/bet.map';
import { BetRepository } from 'src/core/application/ports/bet.repository';
import { Bet } from 'src/core/domain/bet';

@Injectable()
export class PrismaBetRepository implements BetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const betData = await this.prisma.bet.findUnique({
      where: { id },
      include: {
        user: true,
        match: true,
      },
    });

    return betData ? BetMap.toDomain(betData) : undefined;
  }

  async save(bet: Bet) {
    const betData = BetMap.toPersistence(bet);
    await this.prisma.bet.create({
      data: {
        ...betData,
        user: {
          connect: {
            id: bet.user.id,
          },
        },
        match: {
          connect: {
            id: bet.match.id,
          },
        },
      },
    });
    await this.prisma.user.update({
      where: { id: bet.user.id },
      data: {
        balance: bet.user.balance,
      },
    });
  }

  async findAll() {
    const betsData = await this.prisma.bet.findMany({
      include: {
        user: true,
        match: true,
      },
    });
    return betsData.map((betData) => BetMap.toDomain(betData));
  }
}
