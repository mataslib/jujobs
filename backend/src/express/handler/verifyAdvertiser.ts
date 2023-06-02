import {Request, Response} from 'express';
import {
  VerifyAdvertiserRequestBody,
  VerifyAdvertiserResultBody,
} from 'shared/src/endpoint/verifyAdvertiser';
import {VerifyAdvertiser} from '../../core/usecase/verifyAdvertiser/verifyAdvertiser';
export const verifyAdvertiserHandler = async (req: Request, res: Response) => {
  const body = req.body as VerifyAdvertiserRequestBody;

  const verifyAdvertiser = new VerifyAdvertiser();

  const result = await verifyAdvertiser.execute(body);

  res.status(200).send(result as VerifyAdvertiserResultBody);
};
