export class EntityValidationError extends Error {
  constructor(public errors: any[]) {
    super('EntityValidationError');
  }
}
