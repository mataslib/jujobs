import {studentRepository} from '../../data/repository/studentRepository';
import {studentMapper} from '../../mapper/studentMapper';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {GetStudentInput, getStudentInputSchema} from './schema';

export class GetStudent {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'getStudent'>}) {
    this.deps = deps;
  }

  public async execute(input: GetStudentInput) {
    const validatedInput = getStudentInputSchema.parse(input);

    // todo get student or student document and findOut allowedAdvertisers list;
    if (
      !this.deps.authorizer.getStudent(
        {studentId: validatedInput.studentId.toString()},
        {}
      )
    ) {
      throw new AuthorizationError();
    }

    const student = await studentRepository.findOneById(
      validatedInput.studentId
    );
    if (!student) throw new NotFoundError();

    return studentMapper.domainToApi(student);
  }
}
