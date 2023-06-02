import { MongoClient, ObjectId } from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument
} from '../../data/collection/advertiserCollection';
import {
  studentCollection,
  StudentDocument
} from '../../data/collection/studentCollection';
import {
  userCollection,
  UserDocument
} from '../../data/collection/userCollection';
import { User } from '../../domain/user/user';
import {
  testAdvertiserId,
  testAdvertiserUserId,
  testStudentId,
  testStudentUserId,
  testUniversityAdminUserId,
  universityAdvertiserId
} from '../../shared/globals';

export class CreateFixtures {
  private deps;

  constructor(deps: {client: MongoClient}) {
    this.deps = deps;
  }

  public async execute() {
    await this.deps.client.connect();
    const fixtures = await createFixtures();
    
    await userCollection.insertOne(fixtures.universityAdminUser),
    await userCollection.insertOne(fixtures.advertiserUser),
    await advertiserCollection.insertOne(fixtures.advertiser),
    await userCollection.insertOne(fixtures.studentUser),
    await studentCollection.insertOne(fixtures.student),
  
    return undefined;
  }
}

async function createFixtures() {
  const {hashedPassword, salt} = await User.hashPassword('testtest');

  const universityAdminUser: UserDocument = {
    _id: new ObjectId(testUniversityAdminUserId),
    createdAt: new Date(),
    email: 'universityAdminUser@jujobs.cz',
    password: hashedPassword,
    passwordSalt: salt,
    roles: ['admin', 'advertiser'],
    advertiserId: new ObjectId(universityAdvertiserId),
  };

  const student: StudentDocument = {
    _id: new ObjectId(testStudentId),
    linkedin: 'https://www.linkedin.com/in/libor-mat%C3%A1sek-b077a11a1/',
    cv: 'https://drive.google.com/file/d/1Ha0bNpAn_vhWxnQnpZ5FJ-JfN_pnV4Mr/view?usp=share_link',
  };
  const studentUser: UserDocument = {
    _id: new ObjectId(testStudentUserId),
    createdAt: new Date(),
    email: 'studentUser@jujobs.cz',
    password: hashedPassword,
    passwordSalt: salt,
    roles: ['student'],
    studentId: new ObjectId(testStudentId),
  };

  const advertiser: AdvertiserDocument = {
    _id: new ObjectId(testAdvertiserId),
    name: 'test advertiser',
  };
  const advertiserUser: UserDocument = {
    _id: new ObjectId(testAdvertiserUserId),
    createdAt: new Date(),
    email: 'advertiserUser@jujobs.cz',
    password: hashedPassword,
    passwordSalt: salt,
    roles: ['advertiser'],
    advertiserId: new ObjectId(testAdvertiserId),
  };

  return {
    universityAdminUser,
    advertiser,
    advertiserUser,
    student,
    studentUser,
  };
}
