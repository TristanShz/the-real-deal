import { Equatable } from '../common/equatable';

const RESULT_VALUES = ['ONE', 'X', 'TWO'] as const;
export type Result = (typeof RESULT_VALUES)[number];

export class InvalidResultError extends Error {
  constructor() {
    super(`Invalid result. Valid values are ${RESULT_VALUES.join(', ')}.`);
  }
}

export class MatchResult implements Equatable<MatchResult> {
  value: Result;
  constructor(v: string) {
    const isValid = this.validate(v);

    if (!isValid) {
      throw new InvalidResultError();
    }

    this.value = v;
  }

  validate(value: string): value is Result {
    return RESULT_VALUES.includes(value as Result);
  }

  equals(other: MatchResult): boolean {
    return this.value === other.value;
  }
}
