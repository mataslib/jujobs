import {Request, Response} from 'express';
import {GetNewJobNotificationConfigResultBody} from 'shared/src/endpoint/getNewJobNotificationConfig';
import {NewJobNotificationConfigRepository} from '../../core/data/repository/newJobNotificationConfigRepository';
import {mongoClient} from '../../core/service/mongoClient';
import {GetNewJobNotificationConfig} from '../../core/usecase/getNewJobNotificationConfig/getNewJobNotificationConfig';
export const getNewJobNotificationConfigHandler = async (
  req: Request,
  res: Response
) => {
  const {userId} = req.params;

  const getNewJobNotificationConfig = new GetNewJobNotificationConfig({
    newJobNotificationConfigRepository: new NewJobNotificationConfigRepository(
      mongoClient
    ),
    authorizer: req.authorizerOfUser,
  });
  const result = await getNewJobNotificationConfig.execute({userId});

  res.status(200).send(result as GetNewJobNotificationConfigResultBody);
};
