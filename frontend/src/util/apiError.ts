import { AxiosError } from "axios";
import { genericErrorMessage } from "./error";

export type ApiOrNetworkError = AxiosError<SerializedError | NetworkError>;

export type NetworkError = {
  message: string;
  code: string;
};

export function isSerializedError(err: unknown): err is SerializedError {
  return (
    err !== null && typeof err === "object" && "name" in err && "message" in err
  );
}

export type SerializedError = {
  name: string;
  message: string;
  stack?: string;
  status?: number;
  cause?: SerializedError;
};

export function parseApiError(apiError: ApiOrNetworkError) {
  if (!apiError.response) {
    // Timeout/Network error or error response without data
    let message: string;

    const translation = {
      [AxiosError.ERR_NETWORK]: "Chyba sítě. Máte spojení?",
    };

    message =
      translation[apiError.code] ?? apiError.message ?? genericErrorMessage;

    return {
      message: message,
    };
  }

  return {
    message:
      apiError.response.data.message ?? apiError.message ?? genericErrorMessage,
  };
}
