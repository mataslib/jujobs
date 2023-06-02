import {ObjectId} from 'mongodb';
import {v4} from 'uuid';
import {User} from '../user/user';
import {
  AdvertiserRegistrationProps,
  CreateAdvertiserRegistrationParams,
} from './schema';

export class AdvertiserRegistration implements AdvertiserRegistrationProps {
  _id!: ObjectId;
  name!: string;
  email!: string;
  password!: string;
  verifyUrl!: string;
  token!: string;
  passwordSalt!: string;

  public constructor(props: AdvertiserRegistrationProps) {
    Object.assign(this, props);
  }

  public static async create(params: CreateAdvertiserRegistrationParams) {
    const token = v4();
    const verifyUrl = `${params.verifyUrl}/${token}`;
    const hashResult = await User.hashPassword(params.password);

    return new AdvertiserRegistration({
      ...params,
      _id: new ObjectId(),
      password: hashResult.hashedPassword,
      passwordSalt: hashResult.salt,
      verifyUrl,
      token,
    });
  }
}
