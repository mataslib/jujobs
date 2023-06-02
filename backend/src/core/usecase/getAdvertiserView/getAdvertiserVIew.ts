import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {NotFoundError} from '../../shared/error';
import {GetAdvertiserInput, getAdvertiserInputSchema} from './schema';

export class GetAdvertiserView {
  public async execute(input: GetAdvertiserInput) {
    const validatedInput = getAdvertiserInputSchema.parse(input);

    const advertiserView = await advertiserRepository.findOneById(
      validatedInput.advertiserId
    );
    if (advertiserView === null) {
      throw new NotFoundError();
    }

    return advertiserView;
  }
}
