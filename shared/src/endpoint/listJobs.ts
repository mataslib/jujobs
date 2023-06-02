import { PaginatedResults } from "../paginations";
import { IJobReadModel } from "../resource/job";

export type ListJobsRequestQuery = {
  page?: number;
} & SearchJob;

export type ListJobsResultBody = PaginatedResults<IJobReadModel>
