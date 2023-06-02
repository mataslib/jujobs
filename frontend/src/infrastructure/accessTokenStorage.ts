import { verifySignedToken } from "src/backend/token";

class AccessTokenStorage {
  storageKey = "token";
  parsedStorageKey = "parsedToken";

  public getToken = () => {
    const storageToken = localStorage.getItem(this.storageKey);
    return storageToken;
  };

  public saveToken = async (token: string | null | undefined) => {
    if (token === null || token === undefined) {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.parsedStorageKey);
      return undefined;
    }

    localStorage.setItem(this.storageKey, token);
    try {
      const parsed = await verifySignedToken(token);
      localStorage.setItem(this.parsedStorageKey, JSON.stringify(parsed));
    } catch (err) {}

    return token;
  };
}

export const accessTokenStorage = new AccessTokenStorage();
