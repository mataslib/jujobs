import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {Advertiser} from '../../domain/advertiser/advertiser';

export class CreateUniversityAdvertiser {
  public async execute() {
    const advertiser = Advertiser.createUniversityAdvertiser();
    await advertiserRepository.save(advertiser);
  }
}
