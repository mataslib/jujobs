import {ObjectId} from 'mongodb';
import {v4} from 'uuid';
import {
  CreateEmailChangeRequestParams,
  EmailChangeRequestProps,
} from './schema';

export class EmailChangeRequest implements EmailChangeRequestProps {
  _id!: ObjectId;
  token!: string;
  userId!: ObjectId;
  verifyEmailUrl!: string;
  newEmail!: string;

  public constructor(props: EmailChangeRequestProps) {
    Object.assign(this, props);
  }

  public static create(params: CreateEmailChangeRequestParams) {
    const token = v4();

    return new EmailChangeRequest({
      _id: new ObjectId(),
      token: token,
      userId: params.userId,
      verifyEmailUrl: `${params.verifyEmailUrl}/${token}`,
      newEmail: params.newEmail,
    });
  }
}
