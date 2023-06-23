import {MongoClient} from 'mongodb';

export class MongoClientFactory {
  public createConnectedClient() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    return client;
  }
}
