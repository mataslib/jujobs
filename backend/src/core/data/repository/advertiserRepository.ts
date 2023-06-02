import {ClientSession, Collection, MongoClient, ObjectId} from 'mongodb';
import {Advertiser} from '../../domain/advertiser/advertiser';
import {mongoClient} from '../../service/mongoClient';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../collection/advertiserCollection';
import {paginatedResults} from '../paginatedResults';

export class AdvertiserRepository {
  client: MongoClient;
  collection: Collection<AdvertiserDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = advertiserCollection;
  }

  public async save(advertiser: Advertiser, session?: ClientSession) {
    return this.collection.updateOne(
      {
        _id: advertiser._id,
      },
      {
        $set: this.toPersistance(advertiser),
      },
      {
        upsert: true,
        session,
      }
    );
  }

  public async findOneById(_id: ObjectId) {
    return this.collection
      .findOne({_id: _id})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  public async findPaginated(search: AdvertiserSearch, page?: number) {
    const _page = page ?? 1;
    const limit = 20;
    const skip = (_page - 1) * limit;

    const buildedFilter = this.buildSearch(search);

    const total = this.collection.countDocuments(buildedFilter);
    const results = this.collection
      .find(buildedFilter, {skip, limit})
      .toArray();

    return paginatedResults({
      results: await results,
      total: await total,
      page: _page,
      limit,
    });
  }
  private toDomain(persistedData: AdvertiserDocument) {
    return new Advertiser(persistedData);
  }

  private toPersistance(
    advertiserRegistration: Advertiser
  ): AdvertiserDocument {
    return advertiserRegistration;
  }

  private buildSearch(search: AdvertiserSearch) {
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

    return filters.length > 0
      ? {
          $and: [...filters],
        }
      : {};
  }
}

export const advertiserRepository = new AdvertiserRepository();

export interface AdvertiserSearch {
  fulltext?: string;
  _id?: ObjectId;
}
