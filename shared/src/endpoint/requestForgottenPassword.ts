export type RequestForgottenPasswordRequestBody = {
  email: string;
  changePasswordUrl: string;
};
export type RequestForgottenPasswordResultBody =
  | {
      requestId: string;
    }
  | undefined;
