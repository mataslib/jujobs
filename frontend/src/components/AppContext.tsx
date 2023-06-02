// src/context/state.js
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ITokenUser } from "shared/src/resource/tokenUser";
import { verifySignedToken } from "src/backend/token";
import { accessTokenStorage } from "../infrastructure/accessTokenStorage";

// Default value here is used only when not wrapped in AppContext.Provider
// - Every page is wrapped with AppContext.Provider, therefore ignore here default value
//    to achieve DRY
// @ts-ignore
const AppContext = createContext<IAppContext>();

export function AppContextWrapper({ children }: { children: ReactNode }) {
  const [userContextState, setUserContextState] = useState<UserContext>({
    token: undefined,
    tokenParsed: undefined,
    user: undefined,
  });

  // On app load, retrieve access token from local storage, and set context state
  useEffect(() => {
    const token = accessTokenStorage.getToken();
    _setUpUserContext(token);
  }, []);

  /**
   * - Parse and verifies token
   * - Syncs (save) with persistent token storage
   * - Sets context state
   *
   * @param token
   */
  async function _setUpUserContext(token: string | null | undefined) {
    if (!token) {
      accessTokenStorage.saveToken(undefined);
      setUserContextState({
        token: undefined,
        tokenParsed: undefined,
        user: undefined,
      });
      return;
    }

    try {
      const tokenParsed = await verifySignedToken(token);
      const authorizableUser = createAuthorizableUser(tokenParsed);

      accessTokenStorage.saveToken(token);

      setUserContextState({
        token: token,
        tokenParsed: tokenParsed.payload,
        user: authorizableUser,
      });
    } catch (err) {
      // expired, invalid, ...
      accessTokenStorage.saveToken(undefined);
      setUserContextState({
        token: undefined,
        tokenParsed: undefined,
        user: undefined,
      });
    }
  }

  return (
    <AppContext.Provider
      value={{
        token: userContextState.token,
        tokenParsed: userContextState.tokenParsed,
        user: userContextState.user,
        // called from outside eg. on logout, login
        setUpUserContext: _setUpUserContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

function createAuthorizableUser(
  tokenParsed: Awaited<ReturnType<typeof verifyAccessToken>>
) {
  const { email, roles, userId, advertiserId, studentId } = tokenParsed.payload;
  const user = {
    email,
    roles,
    userId,
    advertiserId,
    studentId,
  };

  return user;
}

type UserContext =
  | {
      user: ITokenUser;
      token: string;
      tokenParsed: object;
    }
  | {
      user: undefined;
      token: undefined;
      tokenParsed: undefined;
    };

type IAppContext = UserContext & {
  setUpUserContext: (token: string | null | undefined) => void;
};
