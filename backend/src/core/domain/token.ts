import {addDays} from 'date-fns';
import {ObjectId} from 'mongodb';
import {createAccessToken} from '../service/token/accessToken';
import {User} from './user/user';

export class Token implements TokenProps {
  private constructor(props: TokenProps) {
    Object.assign(this, props);
  }
  _id!: ObjectId;
  createdAt!: Date;
  expiresAt!: Date;
  jwtToken!: string;
  userId!: string;
  email!: string;

  public static async createForUser(user: User): Promise<Token> {
    const createdAt = new Date();
    const expiresAt = addDays(new Date(createdAt), 7);
    const email = user.email;
    const roles = user.roles;
    const userId = user._id.toString();

    const jwtToken = await createAccessToken({
      payload: {
        email: email,
        userId: userId,
        roles: roles,
        advertiserId: user?.advertiserId?.toString(),
        studentId: user?.studentId?.toString(),
      },
      createdAt: createdAt,
      expiresAt: expiresAt,
    });

    const token = new Token({
      _id: new ObjectId(),
      userId: userId,
      email: email,
      jwtToken: jwtToken,
      createdAt: createdAt,
      expiresAt: expiresAt,
    });

    return token;
  }
}

interface TokenProps {
  _id: ObjectId;
  createdAt: Date;
  expiresAt: Date;
  jwtToken: string;
  userId: string;
  email: string;
}
