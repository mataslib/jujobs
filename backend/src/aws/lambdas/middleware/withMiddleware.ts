import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import {TokenUser} from '../../../core/domain/tokenUser/tokenUser';
import {IAuthorizerOfUser} from '../../../core/service/authorizer';
import {verifyAccessToken} from '../../../core/service/token/accessToken';
import {DiscriminableErrorDto} from '../../../core/shared/dto';
import {
  AuthorizationError,
  AuthorizationErrorDto,
  UnexpectedError,
  UnexpectedErrorDto,
} from '../../../core/shared/error';
import {err, ok} from '../../../core/shared/result';
import {errDto} from '../../../core/shared/usecase';
import {authorizerOfUser} from '../../../core/service/authorizer';

export type MyContext = {};

type APIGatewayProxyHandlerV2WithMyContext = (
  ...args: [...Parameters<APIGatewayProxyHandlerV2>, MyContext]
) => Promise<APIGatewayProxyStructuredResultV2>;

/**
 * Verifies Authorization token if given, returning 400 if invalid
 * Passes MyContext to handler including current user etc..
 * Wraps existing of handler in try-catch for unexpected errors
 * Adds CORS (ignore) to handler response
 */
export const withMiddleware = (
  innerHandler: APIGatewayProxyHandlerV2WithMyContext
) => {
  const wrapperHandler: WrapperHandler = async (
    event,
    context,
    callback,
    myContext
  ) => {
    // lowercase all requested headers so they can be accessed without headache!
    for (const key in event.headers) {
      event.headers[key.toLowerCase()] = event.headers[key];
    }

    let httpResponse;
    // Add CORS headers to final response
    const corsAllowAllHeaders = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
    };

    // wrap whole usecase handler in try/catch for unexpected errors
    try {
      // Execute usecase with myContext provided
      const httpResponse = await innerHandler(
        event,
        context,
        callback,
        myContext
      );
      // log error httpResponses to lambda log
      if ((httpResponse?.statusCode ?? 200) >= 400) {
        console.error(httpResponse);
      }

      return {
        ...httpResponse,
        ...corsAllowAllHeaders,
      };
    } catch (err) {
      // try to log original error to lambda logs
      console.error(err);
      const unexpectedDto = new UnexpectedError(err).toDTO();
      const httpResponse = {
        statusCode: 500,
        body: JSON.stringify(errDto(unexpectedDto)),
      };
      // log error response to lambda logs
      console.error(httpResponse);
      return {
        ...httpResponse,
        ...corsAllowAllHeaders,
      };
    }
  };

  return wrapperHandler;
};

export const withAuthenticatedUser = (
  innerHandler: (
    ...args: [...Parameters<APIGatewayProxyHandlerV2>, ContextAuthenticatedUser]
  ) => Promise<APIGatewayProxyStructuredResultV2>
) => {
  const wrapperHandler: WrapperHandler = async (
    event,
    context,
    callback,
    myContext
  ) => {
    // Verify and add user
    const userOrError = await handleAuth(event);

    if (userOrError.isError()) {
      const httpError = userOrError.error().toDTO();
      return {
        statusCode: httpError.statusCode,
        body: JSON.stringify(errDto(httpError)),
      };
    }
    const user = userOrError.value();

    if (user === null) {
      const authErrrorDto = new AuthorizationError(
        `Authorization token is required but missing`
      ).toDTO();
      return {
        statusCode: authErrrorDto.statusCode,
        body: JSON.stringify(errDto(authErrrorDto)),
      };
    }

    return innerHandler(event, context, callback, {
      ...myContext,
      user: user,
      authorizerOfUser: authorizerOfUser(user),
    });
  };

  return wrapperHandler;
};

/**
 * If access token given: verifies and returns current user
 * If no access token given: returns null
 */
async function handleAuth(event: APIGatewayProxyEventV2) {
  const authorization =
    event.headers['Authorization'] ?? event.headers['authorization'] ?? '';
  if (authorization) {
    try {
      const token = authorization.split(' ')[1];
      const parsedToken = await verifyAccessToken(token);
      const user = TokenUser.fromTokenPayload(parsedToken.payload);
      return ok(user);
    } catch (error) {
      // see verifySignedToken for possible errors,
      // |- I'm returning general error for now,
      // |- in future, I may return more specific error
      // expired
      // invalid
      // modified
      // ...
      console.error(error);
      return err(new AuthorizationError());
    }
  }

  return ok(null);
}
export type ContextAuthenticatedUser = {
  user: TokenUser;
  authorizerOfUser: IAuthorizerOfUser;
};

type WrapperHandler = (
  ...args: [...Parameters<APIGatewayProxyHandlerV2>, MyContext]
) => Promise<APIGatewayProxyStructuredResultV2>;

export type WithMiddlewarePayload<TPayload> =
  | TPayload
  | DiscriminableErrorDto<UnexpectedErrorDto>;

// export type withUnexpectedErrorPayload<TPayload> =
//   | TPayload
//   | DiscriminableErrorDto<UnexpectedErrorDto>;

export type WithAuthenticatedUserPayload<TPayload> =
  | TPayload
  | DiscriminableErrorDto<AuthorizationErrorDto>;
