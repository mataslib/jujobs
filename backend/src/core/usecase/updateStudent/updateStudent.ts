import { studentRepository } from '../../data/repository/studentRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {UpdateStudentInput, updateStudentInputSchema} from './schema';

export class UpdateStudent {
  private deps;

  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'updateStudent'>}) {
    this.deps = deps;
  }

  // 1. validate input
  // 2. find user
  // 3. update user's student
  //  3.1. if input contains logo, upload logo
  //    3.1.1 if upload fails and logo is only input - return error
  //
  async execute(input: UpdateStudentInput) {
    const validatedInput = updateStudentInputSchema.parse(input);

    const {studentId, ...updateInput} = validatedInput;

    if (
      !this.deps.authorizer.updateStudent({
        studentId: studentId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const student = await studentRepository.findOneById(studentId);
    if (!student) {
      throw new NotFoundError();
    }

    const updateResult = student.update(updateInput);

    await studentRepository.save(student);

    return undefined;
  }
}
