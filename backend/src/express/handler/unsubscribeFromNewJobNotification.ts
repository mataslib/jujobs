import {Request, Response} from 'express';
import {
  UnsubscribeFromNewJobNotificationRequestBody,
  UnsubscribeFromNewJobNotificationResultBody,
} from 'shared/src/endpoint/unsubcribeFromNewJobNotification';
import {UnsubscribeFromNewJobNotification} from '../../core/usecase/unsubscribeFromNewJobNotification/unsubscribeFromNewJobNotification';
export const unsubscribeFromNewJobNotificationHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as UnsubscribeFromNewJobNotificationRequestBody;

  const deleteNewJobNotificationConfig = new UnsubscribeFromNewJobNotification({
    authorizer: req.authorizerOfUser,
  });
  const result = await deleteNewJobNotificationConfig.execute(body);

  const resBody: UnsubscribeFromNewJobNotificationResultBody = result;
  res.status(200).send(resBody);
};
