export const envVars = {
  ...(process.env as {
    DB_CONNECTION_STRING: string;
    DB_DATABASE_NAME: string;
    ACCESS_TOKEN_SIGN_PRIVATE_KEY: string;
    SIGN_PRIVATE_KEY: string;
  }),
};
