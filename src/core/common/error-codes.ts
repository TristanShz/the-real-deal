export type ErrorCodeDescription = {
  code: number;
  message: string;
};

export class ErrorCode {
  // Common

  public static SUCCESS: ErrorCodeDescription = {
    code: 200,
    message: 'Success.',
  };

  public static BAD_REQUEST_ERROR: ErrorCodeDescription = {
    code: 400,
    message: 'Bad request.',
  };

  public static UNKNOW_ERROR: ErrorCodeDescription = {
    code: 400,
    message: 'Unknown error.',
  };

  public static UNAUTHORIZED_ERROR: ErrorCodeDescription = {
    code: 401,
    message: 'Unauthorized error.',
  };

  public static WRONG_CREDENTIALS_ERROR: ErrorCodeDescription = {
    code: 402,
    message: 'Wrong Credentials.',
  };

  public static ACCESS_DENIED_ERROR: ErrorCodeDescription = {
    code: 403,
    message: 'Access denied.',
  };

  public static NOT_FOUND: ErrorCodeDescription = {
    code: 404,
    message: 'Not found.',
  };

  public static INTERNAL_ERROR: ErrorCodeDescription = {
    code: 500,
    message: 'Internal error.',
  };

  public static ENTITY_NOT_FOUND_ERROR: ErrorCodeDescription = {
    code: 1000,
    message: 'Entity not found.',
  };

  public static ENTITY_VALIDATION_ERROR: ErrorCodeDescription = {
    code: 1001,
    message: 'Entity validation error.',
  };

  public static USE_CASE_PORT_VALIDATION_ERROR: ErrorCodeDescription = {
    code: 1002,
    message: 'Use-case port validation error.',
  };

  public static VALUE_OBJECT_VALIDATION_ERROR: ErrorCodeDescription = {
    code: 1003,
    message: 'Value object validation error.',
  };

  public static ENTITY_ALREADY_EXISTS_ERROR: ErrorCodeDescription = {
    code: 1004,
    message: 'Entity already exists.',
  };
}
