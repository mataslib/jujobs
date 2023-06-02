import {Request, Response} from 'express';
import {
  SubscribeToNewJobNotificationRequestBody,
  SubscribeToNewJobNotificationResultBody,
} from 'shared/src/endpoint/subscribeToNewJobNotification';
import {SubscribeToNewJobNotification} from '../../core/usecase/subscribeToNewJobNotification/subscribeToNewJobNotification';

export const subscribeToNewJobNotificationHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as SubscribeToNewJobNotificationRequestBody;

  const saveNewJobNotificationConfig = new SubscribeToNewJobNotification({
    authorizer: req.authorizerOfUser,
  });
  const result = await saveNewJobNotificationConfig.execute(body);

  const resBody: SubscribeToNewJobNotificationResultBody = result;
  res.status(200).send(resBody);
};
