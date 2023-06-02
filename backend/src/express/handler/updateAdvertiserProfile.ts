import {Request, Response} from 'express';
import {
  UpdateAdvertiserProfileRequestBody,
  UpdateAdvertiserProfileResultBody,
} from 'shared/src/endpoint/updateAdvertiserProfile';
import {S3FileUploader} from '../../core/service/fileUploader';
import {UpdateAdvertiserProfile} from '../../core/usecase/updateAdvertiserProfile/updateAdvertiserProfile';

export const updateAdvertiserProfileHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as UpdateAdvertiserProfileRequestBody;

  const updateAdvertiserProfile = new UpdateAdvertiserProfile({
    fileUploader: new S3FileUploader(),
    authorizer: req.authorizerOfUser,
  });

  const result = await updateAdvertiserProfile.execute({
    ...body,
  });

  res.status(200).send(result as UpdateAdvertiserProfileResultBody);
};
