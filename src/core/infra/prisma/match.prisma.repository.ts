import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MatchMap } from 'src/core/application/mappers/match.map';
import { MatchRepository } from 'src/core/application/ports/match.repository';

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const matchData = await this.prisma.match.findUnique({
      where: { id },
    });

    return matchData ? MatchMap.toDomain(matchData) : undefined;
  }
}
