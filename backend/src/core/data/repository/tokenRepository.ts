// import {Collection, MongoClient, ObjectId} from 'mongodb';
// import {Token} from '../../domain/token';
// import {tokenCollection, TokenDocument} from '../collection/tokenCollection';

// export class TokenRepository {
//   client: MongoClient;
//   collection: Collection<TokenDocument>;
//   constructor(client: MongoClient) {
//     this.client = client;
//     this.collection = tokenCollection;
//   }

//   public async save(token: Token) {
//     return this.collection.replaceOne(
//       {_id: token._id},
//       this.toPersistence(token),
//       {
//         upsert: true,
//       }
//     );
//   }

//   public async get(_id: ObjectId) {
//     return this.collection.findOne({_id: _id}).then(result => {
//       return result;
//     });
//   }

//   toPersistence(token: Token) {
//     return {
//       _id: token._id,
//       ...token.props,
//     };
//   }
// }
