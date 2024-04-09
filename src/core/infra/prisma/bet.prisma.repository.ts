import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BetRepository } from 'src/core/application/bet.repository';
import { Bet } from 'src/core/domain/bet';

@Injectable()
export class PrismaBetRepository implements BetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const betData = await this.prisma.bet.findUnique({
      where: { id },
    });

    return betData ? Bet.fromData(betData) : undefined;
  }

  async save(bet: Bet) {
    await this.prisma.bet.create({
      data: bet.data,
    });
  }

  async findAll() {
    const betsData = await this.prisma.bet.findMany();
    return betsData.map((betData) => Bet.fromData(betData));
  }
}
