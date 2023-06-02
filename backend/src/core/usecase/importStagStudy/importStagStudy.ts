// import {StudentRepository} from '../../data/repository/studentRepository';
import axios from 'axios';
import {studentRepository} from '../../data/repository/studentRepository';

import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {StagGetPredmetAbsolvovalResponse} from '../../stag/getPredmetAbsolvoval';
import {StagGetStagUserForActualUserResponse} from '../../stag/getStagUserForActualUser';
import {StagGetStudentInfoResponse} from '../../stag/getStudentInfo';
import {ImportStagStudyInput, importStagStudySchema} from './schema';

export class ImportStagStudy {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'importStagStudy'>}) {
    this.deps = deps;
  }

  // 1. validated input
  // 2. validate current user really owns given stag token (email match?)
  // 3. import stag data and save to db
  public async execute(input: ImportStagStudyInput) {
    const validatedInput = importStagStudySchema.parse(input);

    if (
      !this.deps.authorizer.importStagStudy({
        studentId: validatedInput.studentId.toString(),
      })
    ) {
      throw new AuthorizationError(`User has not student role`);
    }

    const student = await studentRepository.findOneById(
      validatedInput.studentId
    );
    if (!student) throw new NotFoundError(`Student document not found!`);

    const getStagUserForActualUser =
      await axios<StagGetStagUserForActualUserResponse>({
        url: `https://stag-ws.jcu.cz/ws/services/rest2/help/getStagUserForActualUser?outputFormat=JSON`,
        auth: {
          username: validatedInput.stagUserTicket,
          password: '',
        },
      });

    // if (getStudentInfoResponse.data.email !== student.data.email) {
    // errDto( return new AuthorizationError(`Stag user email does not match your student email`))
    // }

    const [getStudentInfoResponse, getStudentPredmetyAbsolvovalResponse] =
      await Promise.all([
        axios<StagGetStudentInfoResponse>({
          url: `https://stag-ws.jcu.cz/ws/services/rest2/student/getStudentInfo?outputFormat=JSON&osCislo=${getStagUserForActualUser.data.osCislo}`,
          auth: {
            username: validatedInput.stagUserTicket,
            password: '',
          },
        }),
        axios<StagGetPredmetAbsolvovalResponse>({
          url: `https://stag-ws.jcu.cz/ws/services/rest2/student/getStudentPredmetyAbsolvoval?outputFormat=JSON&osCislo=${getStagUserForActualUser.data.osCislo}`,
          auth: {
            username: validatedInput.stagUserTicket,
            password: '',
          },
        }),
      ]);

    student.createStudyFromStagImport({
      nazevSp: getStudentInfoResponse.data.nazevSp,
      fakultaSp: getStudentInfoResponse.data.fakultaSp,
      typSpKey: getStudentInfoResponse.data.typSpKey,
      // oborSp: getStudentInfoResponse.data.,
      predmetAbsolvoval:
        getStudentPredmetyAbsolvovalResponse.data.predmetAbsolvoval,
    });

    await studentRepository.save(student);
  }
}
