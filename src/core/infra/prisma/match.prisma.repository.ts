import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MatchRepository } from 'src/core/application/ports/match.repository';
import { Match } from 'src/core/domain/match';

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const matchData = await this.prisma.match.findUnique({
      where: { id },
    });

    return matchData
      ? Match.fromData({
          id: matchData.id,
          status: matchData.status,
        })
      : undefined;
  }
}
