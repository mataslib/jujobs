import {ObjectId} from 'mongodb';
import {pickBy} from 'lodash';
/**
 * genereates new _id if object hasn't one already
 */
export function withId<T extends {}>(data: T): T & {_id: ObjectId} {
  return {
    ...data,
    _id: new ObjectId(),
  };
}

export const removeEmpty = obj => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};


