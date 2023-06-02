import {Request, Response} from 'express';
import {
  ImportStagStudyRequestBody,
  ImportStagStudyResultBody,
} from 'shared/src/endpoint/importStagStudy';
import type {} from 'zod';
import {ImportStagStudy} from '../../core/usecase/importStagStudy/importStagStudy';

export const importStagStudyHandler = async (req: Request, res: Response) => {
  const body = req.body as ImportStagStudyRequestBody;

  const importStagStudy = new ImportStagStudy({
    authorizer: req.authorizerOfUser,
  });

  const result = await importStagStudy.execute({
    ...body,
  });

  res.status(200).send(result as ImportStagStudyResultBody);
};
