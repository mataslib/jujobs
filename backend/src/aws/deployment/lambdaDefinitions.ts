import {HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';

export const lambdas = {
  saveJobFilter: {
    id: 'saveJobFilter(id)',
    logicalId: 'saveJobFilter',
    file: 'saveJobFilter.ts',
    api: {
      path: '/saveJobFilter',
      method: HttpMethod.POST,
    },
  },
  getJobFilter: {
    id: 'getJobFilter(id)',
    logicalId: 'getJobFilter',
    file: 'getJobFilter.ts',
    api: {
      path: '/getJobFilter',
      method: HttpMethod.GET,
    },
  },
  saveNewJobNotificationConfig: {
    id: 'saveNewJobNotificationConfig(id)',
    logicalId: 'saveNewJobNotificationConfig',
    file: 'saveNewJobNotificationConfig.ts',
    api: {
      path: '/saveNewJobNotificationConfig',
      method: HttpMethod.POST,
    },
  },
  deleteNewJobNotificationConfig: {
    id: 'deleteNewJobNotificationConfig(id)',
    logicalId: 'deleteNewJobNotificationConfig',
    file: 'deleteNewJobNotificationConfig.ts',
    api: {
      path: '/deleteNewJobNotificationConfig',
      method: HttpMethod.DELETE,
    },
  },
  getNewJobNotificationConfig: {
    id: 'getNewJobNotificationConfig(id)',
    logicalId: 'getNewJobNotificationConfig',
    file: 'getNewJobNotificationConfig.ts',
    api: {
      path: '/getNewJobNotificationConfig/{userId}',
      method: HttpMethod.GET,
    },
  },
  createJob: {
    id: 'createJob(id)',
    logicalId: 'createJob',
    file: 'createJob.ts',
    api: {
      path: '/createJob',
      method: HttpMethod.POST,
    },
  },
  updateJob: {
    id: 'updateJob(id)',
    logicalId: 'updateJob',
    file: 'updateJob.ts',
    api: {
      path: '/updateJob',
      method: HttpMethod.POST,
    },
  },
  approveJob: {
    id: 'approveJob(id)',
    logicalId: 'approveJob',
    file: 'approveJob.ts',
    api: {
      path: '/approveJob',
      method: HttpMethod.POST,
    },
  },
  archiveJob: {
    id: 'archiveJob(id)',
    logicalId: 'archiveJob',
    file: 'archiveJob.ts',
    api: {
      path: '/archiveJob',
      method: HttpMethod.POST,
    },
  },
  deleteJob: {
    id: 'deleteJob(id)',
    logicalId: 'deleteJob',
    file: 'deleteJob.ts',
    api: {
      path: '/deleteJob',
      method: HttpMethod.POST,
    },
  },
  replyToJob: {
    id: 'replyToJob(id)',
    logicalId: 'replyToJob',
    file: 'replyToJob.ts',
    api: {
      path: '/replyToJob',
      method: HttpMethod.POST,
    },
  },
  listJobs: {
    id: 'listJobs(id)',
    logicalId: 'listJobs',
    file: 'listJobs.ts',
    api: {
      path: '/listJobs',
      method: HttpMethod.GET,
    },
  },
  listAdvertisers: {
    id: 'listAdvertisers(id)',
    logicalId: 'listAdvertisers',
    file: 'listAdvertisers.ts',
    api: {
      path: '/listAdvertisers',
      method: HttpMethod.GET,
    },
  },
  registerAdvertiser: {
    id: 'registerAdvertiser(id)',
    logicalId: 'registerAdvertiser',
    file: 'registerAdvertiser.ts',
    api: {
      path: '/registerAdvertiser',
      method: HttpMethod.POST,
    },
  },
  verifyAdvertiser: {
    id: 'verifyAdvertiser(id)',
    logicalId: 'verifyAdvertiser',
    file: 'verifyAdvertiser.ts',
    api: {
      path: '/verifyAdvertiser',
      method: HttpMethod.POST,
    },
  },
  authenticate: {
    id: 'authenticate(id)',
    logicalId: 'authenticate',
    file: 'authenticate.ts',
    api: {
      path: '/authenticate',
      method: HttpMethod.POST,
    },
  },
  updateAdvertiserProfile: {
    id: 'updateAdvertiserProfile(id)',
    logicalId: 'updateAdvertiserProfile',
    file: 'updateAdvertiserProfile.ts',
    api: {
      path: '/updateAdvertiserProfile',
      method: HttpMethod.POST,
    },
  },
  updateUser: {
    id: 'updateUser(id)',
    logicalId: 'updateUser',
    file: 'updateUser.ts',
    api: {
      path: '/updateUser',
      method: HttpMethod.POST,
    },
  },
  requestEmailChange: {
    id: 'requestEmailChange(id)',
    logicalId: 'requestEmailChange',
    file: 'requestEmailChange.ts',
    api: {
      path: '/requestEmailChange',
      method: HttpMethod.POST,
    },
  },
  verifyEmailChange: {
    id: 'verifyEmailChange(id)',
    logicalId: 'verifyEmailChange',
    file: 'verifyEmailChange.ts',
    api: {
      path: '/verifyEmailChange',
      method: HttpMethod.POST,
    },
  },
  sesFeedback: {
    id: 'sesFeedback(id)',
    logicalId: 'sesFeedback',
    file: 'sesFeedback.ts',
  },
  getJobView: {
    id: 'getJobView(id)',
    logicalId: 'getJobView',
    file: 'getJobView.ts',
    api: {
      path: '/getJobView/{jobId}',
      method: HttpMethod.GET,
    },
  },
  getAdvertiserView: {
    id: 'getAdvertiserView(id)',
    logicalId: 'getAdvertiserView',
    file: 'getAdvertiserView.ts',
    api: {
      path: '/getAdvertiserView/{advertiserId}',
      method: HttpMethod.GET,
    },
  },
  getStudent: {
    id: 'getStudent(id)',
    logicalId: 'getStudent',
    file: 'getStudent.ts',
    api: {
      path: '/getStudent/{studentId}',
      method: HttpMethod.GET,
    },
  },
  requestForgottenPassword: {
    id: 'requestForgottenPassword(id)',
    logicalId: 'requestForgottenPassword',
    file: 'requestForgottenPassword.ts',
    api: {
      path: '/requestForgottenPassword',
      method: HttpMethod.POST,
    },
  },
  resetForgottenPassword: {
    id: 'resetForgottenPassword(id)',
    logicalId: 'resetForgottenPassword',
    file: 'resetForgottenPassword.ts',
    api: {
      path: '/resetForgottenPassword',
      method: HttpMethod.POST,
    },
  },
  importStagStudy: {
    id: 'importStagStudy(id)',
    logicalId: 'importStagStudy',
    file: 'importStagStudy.ts',
    api: {
      path: '/importStagStudy',
      method: HttpMethod.POST,
    },
  },
  updateStudent: {
    id: 'updateStudent(id)',
    logicalId: 'updateStudent',
    file: 'updateStudent.ts',
    api: {
      path: '/updateStudent',
      method: HttpMethod.POST,
    },
  },
  deleteStudy: {
    id: 'deleteStudy(id)',
    logicalId: 'deleteStudy',
    file: 'deleteStudy.ts',
    api: {
      path: '/deleteStudy',
      method: HttpMethod.DELETE,
    },
  },
  createStudy: {
    id: 'createStudy(id)',
    logicalId: 'createStudy',
    file: 'createStudy.ts',
    api: {
      path: '/createStudy',
      method: HttpMethod.POST,
    },
  },
  updateStudy: {
    id: 'updateStudy(id)',
    logicalId: 'updateStudy',
    file: 'updateStudy.ts',
    api: {
      path: '/updateStudy',
      method: HttpMethod.POST,
    },
  },
};

