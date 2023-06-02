import {jobRepository} from '../../data/repository/jobRepository';
import {jobMapper} from '../../mapper/jobMapper';
import {ListJobsInput, listJobsSchema} from './schema';

export class ListJobs {
  async execute(input: ListJobsInput) {
    const validatedInput = listJobsSchema.parse(input);

    const {page, ...search} = validatedInput;

    const result = await jobRepository.findPaginated(search, page);

    return {
      ...result,
      results: result.results.map(doc => jobMapper.domainToApi(doc)),
    };
  }
}
