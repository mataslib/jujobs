// https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-request
import type { TokenUser } from "../core/domain/tokenUser/tokenUser";
import type { IAuthorizerOfUser } from "../core/service/authorizer";

export {};

declare global {
  namespace Express {
    interface Request {
      user: TokenUser;
      authorizerOfUser: IAuthorizerOfUser
    }
  }
}