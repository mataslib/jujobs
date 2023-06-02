import { Alert } from "@mui/material";
import { isAxiosError } from "../infrastructure/api";

export const ApiErrorAlert = (props: {
  error: any;
  messageByType?: {
    [key: string]: string;
  };
}) => {
  const { error } = props;

  if (!error) {
    return null;
  }

  let message: string | undefined = undefined;

  if (typeof error === "string") {
    message = error;
  }

  if (isAxiosError<any>(error)) {
    const errorDto = error.response?.data;

    if (errorDto && errorDto.type) {
      if (props?.messageByType?.[errorDto.name] !== undefined) {
        message = props.messageByType[errorDto.name];
      } else {
        message = errorMap[errorDto.name] ?? errorDto.message;
      }
    }

    if (!message) {
      message = `${error.message} [${error.code}]`;
    }
  }

  if (!message && error?.message) {
    message = error.message;
  }

  return <Alert severity="error">{message ?? `Neočekávaná chyba.`}</Alert>;
};

const errorMap: { [key: string]: string } = {
  UploadError: "Upload selhal.",
  NotFoundError: "Nenalezeno.",
  InvalidCredentials: "Nesprávné přihlašovací údaje.",
  UnexpectedError: "Neočekávaná chyba",
  AuthorizationError: "Nedostatečná oprávnění.",
  ValidationError: "Data nejsou v očekáváné podobě.",
};
