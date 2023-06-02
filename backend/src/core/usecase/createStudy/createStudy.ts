import {studentRepository} from '../../data/repository/studentRepository';
import {Study} from '../../domain/student/study/study';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {CreateStudyInput, createStudyInputSchema} from './schema';

export class CreateStudy {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'createStudy'>}) {
    this.deps = deps;
  }
  public async execute(input: CreateStudyInput) {
    const validatedInput = createStudyInputSchema.parse(input);

    const {studentId, ...createStudyParams} = validatedInput;

    if (
      !this.deps.authorizer.createStudy({
        studentId: studentId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const student = await studentRepository.findOneById(studentId);
    if (!student) {
      throw new NotFoundError();
    }

    const study = Study.createFromUserData(createStudyParams);
    student.createStudyFromUserData(study);

    await studentRepository.save(student);

    return {
      studyId: study._id.toString(),
    };
  }
}
