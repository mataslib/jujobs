import {Request, Response} from 'express';
import {
  ListAdvertisersRequestQuery,
  ListAdvertisersResultBody,
} from 'shared/src/endpoint/listAdvertisers';
import type {} from 'zod';
import {ListAdvertisers} from '../../core/usecase/listAdvertisers/listAdvertisers';

export const listAdvertisersHandler = async (req: Request, res: Response) => {
  const listAdvertisers = new ListAdvertisers();
  const result = await listAdvertisers.execute(
    req.query as ListAdvertisersRequestQuery
  );

  res.status(200).send(result as ListAdvertisersResultBody);
};
