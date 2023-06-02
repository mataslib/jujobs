import { MongoClient, ObjectId } from 'mongodb';
import { advertiserCollection } from '../../data/collection/advertiserCollection';
import { studentCollection } from '../../data/collection/studentCollection';
import { userCollection } from '../../data/collection/userCollection';
import {
  testAdvertiserId,
  testAdvertiserUserId,
  testStudentId,
  testStudentUserId,
  testUniversityAdminUserId
} from '../../shared/globals';

export class DeleteFixtures {
  private deps;

  constructor(deps: {client: MongoClient}) {
    this.deps = deps;
  }

  public async execute() {
    await this.deps.client.connect();    
   
    await userCollection.deleteOne({_id: new ObjectId(testUniversityAdminUserId)}),
    await userCollection.deleteOne({_id: new ObjectId(testAdvertiserUserId)}),
    await advertiserCollection.deleteOne({_id: new ObjectId(testAdvertiserId)}),
    await userCollection.deleteOne({_id: new ObjectId(testStudentUserId)}),
    await studentCollection.deleteOne({_id: new ObjectId(testStudentId)}),
    // jobCollection.deleteMany({advertiser: {_id: }})
    
    return undefined;
  }
}
