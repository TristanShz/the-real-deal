export class MatchAlreadyStartedError extends Error {
  constructor() {
    super('Match already started');
  }
}
export class MatchNotFoundError extends Error {
  constructor() {
    super('Match not found');
  }
}
export class MatchEndedError extends Error {
  constructor() {
    super('Match ended');
  }
}
export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}

export class InvalidAmountError extends Error {
  constructor() {
    super('Bet amount must be greater than 0');
  }
}
