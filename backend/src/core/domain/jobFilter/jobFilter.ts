import {CreateParams, createParamsSchema, JobFilterData} from './schema';

export class JobFilter {
  private _data: JobFilterData;

  public get data() {
    return this._data;
  }

  private constructor(data: JobFilterData) {
    this._data = data;
  }

  public static create(params: CreateParams) {
    const validatedParams = createParamsSchema.parse(params);

    const jobFilter = new JobFilter({
      ...validatedParams,
    });

    return jobFilter;
  }

  public static unsafeConstruct(data: JobFilterData) {
    return new JobFilter(data);
  }
}
