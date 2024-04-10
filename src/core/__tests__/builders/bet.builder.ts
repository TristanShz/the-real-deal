export const betBuilder = ({
  id = 1,
  amount = 10,
  odds = 2,
  result = '1',
  matchId = 1,
  userId = 1,
}: {
  id?: number;
  amount?: number;
  odds?: number;
  result?: string;
  matchId?: number;
  userId?: number;
}) => {
  const props = { id, amount, odds, result, matchId, userId };

  return {
    withId(id: number) {
      return betBuilder({ ...props, id });
    },
    withAmount(amount: number) {
      return betBuilder({ ...props, amount });
    },
    withOdds(odds: number) {
      return betBuilder({ ...props, odds });
    },
    result(result: string) {
      return betBuilder({ ...props, result });
    },
    withMatchId(matchId: number) {
      return betBuilder({ ...props, matchId });
    },
    withUserId(userId: number) {
      return betBuilder({ ...props, userId });
    },
    build() {
      return props;
    },
  };
};
