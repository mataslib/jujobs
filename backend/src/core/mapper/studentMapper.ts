import {IStudentReadModel} from 'shared/src/resource/student';
import {Student} from '../domain/student/student';
export const domainToApi = (doc: Student): IStudentReadModel => {
  return {
    _id: doc._id.toString(),
    linkedin: doc.linkedin,
    cv: doc.cv,
    studies: doc.studies?.map(study => {
      return {
        _id: study._id.toString(),
        dataSource: study.dataSource,
        fakultaSp: study.fakultaSp,
        nazevSp: study.nazevSp,
        predmetAbsolvoval: study.predmetAbsolvoval,
        typSpKey: study.typSpKey,
      };
    }),
  };
};

export const studentMapper = {
  domainToApi: domainToApi,
};
