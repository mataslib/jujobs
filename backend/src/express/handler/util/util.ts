import {Response} from 'express';
export const sendApiResult = <TData>(
  res: Response,
  data: TData,
  options?: {
    statusCode?: number;
  }
) => {
  return res.status(options?.statusCode || 200).send({
    result: data,
  });
};
