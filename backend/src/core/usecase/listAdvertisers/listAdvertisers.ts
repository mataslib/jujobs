import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {ListAdvertisersInput, listAdvertisersSchema} from './schema';

export class ListAdvertisers {
  async execute(input: ListAdvertisersInput) {
    const validatedInput = listAdvertisersSchema.parse(input);
    const result = await advertiserRepository.findPaginated(validatedInput);
    return result;
  }
}
