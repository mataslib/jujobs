import {MongoClient} from 'mongodb';
import {envVars} from '../shared/env';

export const mongoClient = new MongoClient(envVars.DB_CONNECTION_STRING);
