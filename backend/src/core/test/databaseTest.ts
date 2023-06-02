import {mongoClient} from '../service/mongoClient';

export function databaseTest() {
  return {
    mongoClient,
  };
}
