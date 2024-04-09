import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.match.upsert({
    where: { id: 'match-1' },
    update: {},
    create: {
      id: 'match-1',
      championship: 'Premier League',
      teamOne: 'Liverpool',
      teamTwo: 'Manchester United',
      date: new Date('2024-03-01T14:00:00Z'),
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-2' },
    update: {},
    create: {
      id: 'match-2',
      championship: 'Premier League',
      teamOne: 'Chelsea',
      teamTwo: 'Arsenal',
      date: new Date('2024-03-06T14:00:00Z'),
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-3' },
    update: {},
    create: {
      id: 'match-3',
      championship: 'Premier League',
      teamOne: 'Manchester City',
      teamTwo: 'Tottenham',
      date: new Date('2024-03-03T14:00:00Z'),
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-4' },
    update: {},
    create: {
      id: 'match-4',
      championship: 'Premier League',
      teamOne: 'Leicester',
      teamTwo: 'Everton',
      date: new Date('2024-03-10T14:00:00Z'),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
