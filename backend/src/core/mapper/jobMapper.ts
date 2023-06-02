import {IJobReadModel} from 'shared/src/resource/job';
import {Job} from '../domain/job/job';

const domainToApi = (job: Job): IJobReadModel => {
  return {
    _id: job._id.toString(),
    title: job.title,
    scope: job.scope,
    text: job.text,
    requirements: job.requirements,
    benefits: job.benefits,
    salary: job.salary,
    place: job.place,
    specificPlace: job.specificPlace,
    startDate: job.startDate,
    deadlineAt: job.deadlineAt.toString(),
    other: job.other,
    legalType: job.legalType,
    durationType: job.durationType,
    employmentType: job.employmentType,
    fieldTypes: job.fieldTypes,
    facultyTypes: job.facultyTypes,
    homeoffice: job.homeoffice,
    createdAt: job.createdAt.toString(),
    updatedAt: job.updatedAt.toString(),
    approved: job.approved,
    archived: job.archived,
    advertiser: {
      _id: job.advertiser._id.toString(),
      name: job.advertiser.name,
      logo: job.advertiser.logo,
      about: job.advertiser.about,
      web: job.advertiser.web,
    },
    // todo: filter based on current user - should be available only for advertisers of job
    replyToEmail: job.replyToEmail,
  };
};

export const jobMapper = {
  domainToApi: domainToApi,
};
