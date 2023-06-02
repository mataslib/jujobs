export class UnexpectedError extends Error {
  public name = 'UnexpectedError';
  public message = 'Neočekávaná chyba';
  public status = 500;
}

export class ValidationError extends Error {
  public name = `ValidationError`;
  public message = `Data nejsou v očekávané podobě`;
  public status = 400;
}
export class AuthorizationError extends Error {
  public name = `AuthorizationError`;
  public message = `Nedostatečná oprávnění`;
  public status = 401;
}
export class NotFoundError extends Error {
  public name = 'NotFoundError';
  public message = 'Nenalezeno';
  public status = 404;
}

export class InvalidCredentialsError extends Error {
  public name = 'InvalidCredentialsError';
  public message = 'Nesprávné přihlašovací údaje';
  public status = 401;
}

export class UploadError extends Error {
  public name = 'UploadError';
  public message = 'Upload selhal';
  public status = 500;
}

export const errorTypes = {
  ValidationError: `ValidationError`,
  UploadError: `UploadError`,
  NotFoundError: `NotFoundError`,
  InvalidCredentials: `InvalidCredentials`,
  UnexpectedError: `UnexpectedError`,
  AuthorizationError: `AuthorizationError`,
} as const;

type ErrorTypesKeys = keyof typeof errorTypes;
export type ErrorTypes = typeof errorTypes;
export type ErrorTypesValues = ErrorTypes[ErrorTypesKeys];

export function serializeError(err: any): SerializedError {
  return {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    status: err?.status,
    cause: err?.cause ? serializeError(err.cause) : undefined,
  };
}

export function isSerializedError(err: unknown): err is SerializedError {
  return (
    err !== null && typeof err === 'object' && 'name' in err && 'message' in err
  );
}

export type SerializedError = {
  name: string;
  message: string;
  stack?: string;
  status?: number;
  cause?: SerializedError;
};

export type ApiError = SerializedError;
