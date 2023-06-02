import { api } from "../infrastructure/api";

/**
 * Servers as Api proxy with ability to use react hooks.
 * Api can be used also in non-react components but should not be used in react components.
 * In these useApi should be used instead since it may intercept api and modify app state,
 * eg. set React context with user access token.
 *
 * @returns
 */
export const useApi = () => {
  return api;
};
