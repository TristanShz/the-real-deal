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
export class InsufficientBalanceError extends Error {
  constructor() {
    super('Insufficient balance');
  }
}
export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}
