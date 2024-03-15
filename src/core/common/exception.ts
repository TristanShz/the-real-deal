import { ErrorCodeDescription } from './error-codes';
export type CreateExceptionPayload<TData> = {
  code: ErrorCodeDescription;
  overrideMessage?: string;
  data?: TData;
};

export class Exception<TData = any> extends Error {
  public readonly code: number;

  public readonly data?: TData;

  private constructor(
    codeDescription: ErrorCodeDescription,
    overrideMessage?: string,
    data?: TData,
  ) {
    super();

    this.name = this.constructor.name;
    this.code = codeDescription.code;
    this.data = data;
    this.message = overrideMessage || codeDescription.message;

    Error.captureStackTrace(this, this.constructor);
  }

  public static of<TData>(
    payload: CreateExceptionPayload<TData>,
  ): Exception<TData> {
    return new Exception(payload.code, payload.overrideMessage, payload.data);
  }
}
