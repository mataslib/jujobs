import {NextFunction, Request, Response} from 'express';
import {TokenUser} from '../core/domain/tokenUser/tokenUser';
import {authorizerOfUser} from '../core/service/authorizer';
import {verifyAccessToken} from '../core/service/token/accessToken';
import {
  AuthorizationError,
  NotFoundError,
  serializeError,
  UnexpectedError,
} from '../core/shared/error';

export function notFoundRouteErrorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new NotFoundError());
}

export function customErrorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`Custom err handler:`, err);
  // must delegate to default error handler when headers already sent (doc)
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Error) {
    return res.status(err.status || 500).send(serializeError(err));
  }

  return res
    .status(500)
    .send(
      serializeError(
        new UnexpectedError(typeof err === 'string' ? err : undefined)
      )
    );
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization ?? '';

  if (!authorizationHeader) {
    return next(new AuthorizationError(`Authorization header is required.`));
  }

  try {
    const token = authorizationHeader.split(' ')[1];
    const parsedToken = await verifyAccessToken(token);
    const tokenUser = TokenUser.fromTokenPayload(parsedToken.payload);
    req.user = tokenUser;
    req.authorizerOfUser = authorizerOfUser(tokenUser);
    next();
  } catch (error) {
    // see verifySignedToken for possible errors,
    // |- I'm returning general error for now,
    // |- in future, I may return more specific error
    // expired
    // invalid
    // modified
    // ...
    // console.error(error);
    return next(
      new AuthorizationError(`Token verification failed`, {
        cause: error,
      })
    );
  }
}
