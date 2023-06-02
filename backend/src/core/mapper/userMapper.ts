import {IUserReadModel} from 'shared/src/resource/user';
import {User} from '../domain/user/user';
export const domainToApi = (doc: User): IUserReadModel => {
  return {
    _id: doc._id.toString(),
    email: doc.email,
    roles: doc.roles,
    advertiserId: doc.advertiserId?.toString(),
    studentId: doc.studentId?.toString(),
    newJobNotificationSubscription: doc.newJobNotificationSubscription,
    createdAt: doc.createdAt.toString(),
  };
};

export const userMapper = {
  domainToApi: domainToApi,
};
