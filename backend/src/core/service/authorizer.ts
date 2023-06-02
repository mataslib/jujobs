import {IAuthorizableUser} from '../domain/authorizableUser';
import {isSameId} from '../shared/sameId';

export function authorizerOfUser(user: IAuthorizableUser) {
  return {
    approveJob: () => user.hasRole('admin'),
    archiveJob: (input: {advertiserId: string}) =>
      user.hasRole('admin') ||
      isSameId(user.getAdvertiserId(), input.advertiserId),
    createJob: (input: {advertiserId: string}) =>
      user.hasRole('admin') ||
      (user.hasRole('advertiser') &&
        isSameId(user.getAdvertiserId(), input.advertiserId)),
    createStudy: (resource: {studentId: string}) =>
      user.hasRole('student') &&
      isSameId(user.getStudentId(), resource.studentId),
    deleteJob: (resource: {advertiserId: string}) =>
      user.hasRole('admin') ||
      (user.hasRole('advertiser') &&
        isSameId(user.getAdvertiserId(), resource.advertiserId)),
    unsubscribeFromNewJobNotification: (input: {userId: string}) =>
      user.hasRole('student') && isSameId(user.getUserId(), input.userId),
    deleteStudy: (resource: {studentId: string}) =>
      user.hasRole('student') &&
      isSameId(user.getStudentId(), resource.studentId),
    getStudent: (
      input: {studentId: string},
      // todo: based on allowed advertiser ids
      resource: {advertiserIds?: string[]}
    ) =>
      user.hasRole('student') && isSameId(user.getStudentId(), input.studentId),
    //   ||
    // (user.hasRole('advertiser') &&
    //   resource.advertiserIds &&
    //   resource.advertiserIds.includes(user.getAdvertiserId()))
    importStagStudy: (input: {studentId: string}) =>
      user.hasRole('student') && isSameId(user.getStudentId(), input.studentId),
    replyToJob: () => user.hasRole('student'),
    requestEmailChange: (input: {userId: string}) =>
      isSameId(user.getUserId(), input.userId),
    subscribeToNewJobNotification: (input: {userId: string}) =>
      user.hasRole('student') && isSameId(user.getUserId(), input.userId),
    updateAdvertiserProfile: (input: {advertiserId: string}) =>
      user.hasRole('admin') ||
      isSameId(user.getAdvertiserId(), input.advertiserId),
    updateJob: (input: {advertiserId: string}) =>
      user.hasRole('admin') ||
      isSameId(user.getAdvertiserId(), input.advertiserId),
    updateStudent: (input: {studentId: string}) =>
      isSameId(user.getStudentId(), input.studentId),
    updateStudy: (resource: {studentId: string}) =>
      isSameId(user.getStudentId(), resource.studentId),
    updateUser: (input: {userId: string}) =>
      isSameId(user.getUserId(), input.userId),
    isAdminOfAdvertiser: (advertiserId: string) =>
      isSameId(user.getAdvertiserId(), advertiserId),
    isUniversityAdmin: () => user.hasRole('admin'),
    getUser: (input: {userId: string}) =>
      isSameId(user.getUserId(), input.userId),
  } as const;
}

export type IAuthorizerOfUser = ReturnType<typeof authorizerOfUser>;
