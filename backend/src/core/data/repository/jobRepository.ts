import {Collection, MongoClient, ObjectId} from 'mongodb';
import {Job} from '../../domain/job/job';
import {mongoClient} from '../../service/mongoClient';
import {jobCollection, JobDocument} from '../collection/jobCollection';
import {paginatedResults} from '../paginatedResults';

export class JobRepository {
  client: MongoClient;
  collection: Collection<JobDocument>;
  constructor() {
    this.client = mongoClient;
    this.collection = jobCollection;
  }

  public async save(job: Job) {
    return this.collection.updateOne(
      {
        _id: job._id,
      },
      {$set: this.toPersistence(job)},
      {upsert: true}
    );
  }

  public async findOneById(_id: ObjectId) {
    return this.collection
      .findOne({_id: _id})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  public async delete(job: Job) {
    return this.collection.deleteOne({
      _id: job._id,
    });
  }

  public async find(search: JobSearch) {
    const buildedFilter = this.buildSearch(search);

    return this.collection
      .find(buildedFilter)
      .map(doc => (doc ? this.toDomain(doc) : null));
  }

  public async findPaginated(search: JobSearch, page?: number) {
    const _page = page ?? 1;
    const isFilteringByAdvertiser = !!search?.advertiserId;
    const filterByAdvertiserLimit = 100;
    const standardLimit = 20;
    const limit = isFilteringByAdvertiser
      ? filterByAdvertiserLimit
      : standardLimit;
    const skip = (_page - 1) * limit;

    const buildedFilter = this.buildSearch(search);

    const total = this.collection.countDocuments(buildedFilter);
    const results = this.collection
      .find(buildedFilter, {skip, limit})
      .map(doc => this.toDomain(doc))
      .toArray();

    return paginatedResults({
      results: await results,
      total: await total,
      page: _page,
      limit,
    });
  }

  private toDomain(persistedData: JobDocument) {
    return new Job(persistedData);
  }

  private toPersistence(job: Job): JobDocument {
    return job;
  }

  private buildSearch(search: JobSearch) {
    const filters = [];

    if (search?.fulltext) {
      filters.push({
        $text: {
          $search: search.fulltext,
        },
      });
    }

    if (search?._id !== undefined) {
      filters.push({
        _id: search._id,
      });
    }

    if (search?.advertiserId !== undefined) {
      filters.push({
        'advertiser._id': search.advertiserId,
      });
    }

    if (search?.homeoffice !== undefined) {
      filters.push({
        homeoffice: search.homeoffice,
      });
    }

    if (search?.employmentType !== undefined) {
      filters.push({
        employmentType: {$in: search.employmentType},
      });
    }

    if (search?.legalType !== undefined) {
      filters.push({
        legalType: {$in: search.legalType},
      });
    }

    if (search?.durationType !== undefined) {
      filters.push({
        durationType: {$in: search.durationType},
      });
    }

    if (search?.place !== undefined) {
      filters.push({
        place: {$in: search.place},
      });
    }

    if (search?.approved !== undefined) {
      filters.push({
        approved: search.approved,
      });
    }

    if (search?.archived !== undefined) {
      filters.push({
        archived: search.archived,
      });
    }

    return filters.length > 0
      ? {
          $and: [...filters],
        }
      : {};
  }
}

export const jobRepository = new JobRepository();

export interface JobSearch {
  _id?: ObjectId;
  advertiserId?: ObjectId;
  fulltext?: string;
  homeoffice?: boolean;
  employmentType?: (
    | 'Plný úvazek'
    | 'Zkrácený úvazek'
    | 'Pracovní doba dle dohody'
  )[];
  legalType?: (
    | 'Dohoda o provedení práce'
    | 'Dohoda o provedení činnosti'
    | 'Pracovní smlouva'
    | 'OSVČ'
    | 'Stáž'
    | 'Praxe'
  )[];
  durationType?: (
    | 'Krátkodobá'
    | 'Krátkodobá s možností navázaní spolupráce'
    | 'Dlouhodobá'
  )[];
  place?: ('Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí')[];
  approved?: boolean;
  archived?: boolean;
}

