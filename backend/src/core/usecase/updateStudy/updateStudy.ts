import {studentRepository} from '../../data/repository/studentRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {UpdateStudyInput, updateStudyInputSchema} from './schema';

export class UpdateStudy {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'updateStudy'>}) {
    this.deps = deps;
  }
  public async execute(input: UpdateStudyInput) {
    const validatedInput = updateStudyInputSchema.parse(input);

    const {studyId, ...updateStudyParams} = validatedInput;

    const student = await studentRepository.findOneByStudyId(studyId);
    if (!student) {
      throw new NotFoundError();
    }

    if (
      !this.deps.authorizer.updateStudy({
        studentId: student._id.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const updateResult = student.updateStudy(studyId, updateStudyParams);

    await studentRepository.save(student);

    return {
      studyId: studyId,
    };
  }
}
