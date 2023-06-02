import {Request, Response} from 'express';
import {GetStudentResultBody} from 'shared/src/endpoint/getStudent';
import {GetStudent} from '../../core/usecase/getStudent/getStudent';

export const getStudentHandler = async (req: Request, res: Response) => {
  const {studentId} = req.params;

  const getStudent = new GetStudent({
    authorizer: req.authorizerOfUser,
  });

  const result: GetStudentResultBody = await getStudent.execute({
    studentId: studentId,
  });

  res.status(200).send(result);
};
