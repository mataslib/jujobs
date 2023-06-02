import { studentRepository } from '../../data/repository/studentRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {DeleteStudyInput, deleteStudyInputSchema} from './schema';

export class DeleteStudy {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'deleteStudy'>}) {
    this.deps = deps;
  }

  public async execute(input: DeleteStudyInput) {
    const validatedInput = deleteStudyInputSchema.parse(input);

    const student = await studentRepository.findOneByStudyId(
      validatedInput.studyId
    );
    if (!student) {
      throw new NotFoundError();
    }

    if (
      !this.deps.authorizer.deleteStudy({
        studentId: student._id.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const deleteResult = student.deleteStudy(validatedInput.studyId);
    await studentRepository.save(student);
  }
}
