import {Request, Response} from 'express';
import {GetAdvertiserViewResultBody} from 'shared/src/endpoint/getAdvertiserView';
import {GetAdvertiserView} from '../../core/usecase/getAdvertiserView/getAdvertiserVIew';

export const getAdvertiserViewHandler = async (req: Request, res: Response) => {
  const {advertiserId} = req.params;

  const getAdvertiserView = new GetAdvertiserView();

  const result = await getAdvertiserView.execute({
    advertiserId: advertiserId,
  });

  return res.status(200).send(result as GetAdvertiserViewResultBody);
};
