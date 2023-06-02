import {Request, Response} from 'express';
import {
  UpdateStudentRequestBody,
  UpdateStudentResultBody,
} from 'shared/src/endpoint/updateStudent';
import {UpdateStudent} from '../../core/usecase/updateStudent/updateStudent';

export const updateStudentHandler = async (req: Request, res: Response) => {
  const body = req.body as UpdateStudentRequestBody;

  const updateStudent = new UpdateStudent({
    authorizer: req.authorizerOfUser,
  });

  const result = await updateStudent.execute(body);

  res.status(200).send(result as UpdateStudentResultBody);
};
