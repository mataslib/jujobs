import {ObjectId} from 'mongodb';
import {v4} from 'uuid';
import {CreateParams, ForgottenPasswordRequestProps} from './schema';

export class ForgottenPasswordRequest implements ForgottenPasswordRequestProps {
  public constructor(props: ForgottenPasswordRequestProps) {
    Object.assign(this, props);
  }
  _id!: ObjectId;
  token!: string;
  userId!: ObjectId;
  changePasswordUrl!: string;

  public static create(params: CreateParams) {
    const token = v4();

    return new ForgottenPasswordRequest({
      _id: new ObjectId(),
      token: token,
      userId: params.userId,
      changePasswordUrl: `${params.changePasswordUrl}/${token}`,
    });
  }
}
