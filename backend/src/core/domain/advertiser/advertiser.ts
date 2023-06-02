import {ObjectId} from 'mongodb';
import {universityAdvertiserId} from '../../shared/globals';
import {AdvertiserRegistration} from '../advertiserRegistration/advertiserRegistration';
import {UpdateParams} from './schema';

export type AdvertiserProps = {};

export class Advertiser implements AdvertiserProps {
  _id!: ObjectId;
  name!: string;
  logo?: string;
  about?: string;
  web?: string;

  public constructor(props: AdvertiserProps) {
    Object.assign(this, props);
  }

  public update(params: UpdateParams) {
    const completeProps: AdvertiserProps = {
      ...this,
      ...params,
    };

    Object.assign(this, completeProps);
  }

  public static fromAdvertiserRegistration(
    advertiserRegistration: AdvertiserRegistration
  ) {
    const advertiser = new Advertiser({
      _id: new ObjectId(),
      name: advertiserRegistration.name,
    });

    return advertiser;
  }

  public static createUniversityAdvertiser() {
    const advertiser = new Advertiser({
      _id: new ObjectId(universityAdvertiserId),
      name: 'Jihočeská univerzita v Českých Budějovicích',
      about:
        'Jsme moderní veřejná vysoká škola sídlící v Českých Budějovicích nabízející jedinečné zkušenosti v široké škále studijních programů. Vzděláváme téměř 9 000 studentů na 8 různých fakultách ve více než 230 programech bakalářských, magisterských a doktorských.',
      web: 'https://www.jcu.cz/',
    });

    return advertiser;
  }
}
