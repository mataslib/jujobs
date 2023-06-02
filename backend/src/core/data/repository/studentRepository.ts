import {ClientSession, Collection, MongoClient, ObjectId} from 'mongodb';
import {Student} from '../../domain/student/student';
import {mongoClient} from '../../service/mongoClient';
import {
  studentCollection,
  StudentDocument,
} from '../collection/studentCollection';

export class StudentRepository {
  client: MongoClient;
  collection: Collection<StudentDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = studentCollection;
  }

  public async save(student: Student, session?: ClientSession) {
    return this.collection
      .updateOne(
        {
          _id: student._id,
        },
        {$set: this.toPersistance(student)},
        {
          upsert: true,
          session,
        }
      )
      .then(result => {
        return result;
      });
  }

  public async findOneById(_id: ObjectId) {
    return this.collection
      .findOne({_id: _id})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  public async findOneByStudyId(studyId: ObjectId) {
    return this.collection
      .findOne({'studies._id': studyId})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  private toDomain(persistedData: StudentDocument) {
    return new Student(persistedData);
  }

  private toPersistance(student: Student): StudentDocument {
    return student;
  }
}

export const studentRepository = new StudentRepository();
