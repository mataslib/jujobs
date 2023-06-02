import {IAdvertiserReadModel} from 'shared/src/resource/advertiser';
import {Advertiser} from '../domain/advertiser/advertiser';

export const domainToApi = (advertiser: Advertiser): IAdvertiserReadModel => {
  return {
    _id: advertiser._id.toString(),
    name: advertiser.name,
    logo: advertiser.logo,
    about: advertiser.about,
    web: advertiser.web,
  };
};

export const advertiserMapper = {
  domainToApi: domainToApi,
};
