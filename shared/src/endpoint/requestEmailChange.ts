export type RequestEmailChangeRequestBody = {
  userId: string;
  newEmail: string;
  verifyEmailUrl: string;
};

export type RequestEmailChangeResultBody = {
  requestId: any;
};
