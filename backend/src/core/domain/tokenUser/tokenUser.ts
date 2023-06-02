import {AccessTokenPayload} from '../../service/token/accessToken';
import {IAuthorizableUser} from '../authorizableUser';

export class TokenUser implements IAuthorizableUser {
  userId!: string;
  email!: string;
  roles!: ('admin' | 'student' | 'advertiser')[];
  advertiserId?: string;
  studentId?: string;

  public isTestUser(): boolean {
    return this.email === 'jujobstest@gmail.com';
  }

  public hasRole(role: 'advertiser' | 'admin' | 'student'): boolean {
    return this.roles?.includes(role) ?? false;
  }

  public getAdvertiserId() {
    return this.advertiserId;
  }

  public getStudentId() {
    return this.studentId;
  }

  public getUserId() {
    return this.userId;
  }

  public getEmail() {
    return this.email;
  }

  public constructor(props: TokenUserData) {
    Object.assign(this, props);
  }

  public static fromTokenPayload(tokenPayload: AccessTokenPayload) {
    return new TokenUser(tokenPayload);
  }

  public static unsafeConstruct(data: Partial<TokenUserData>) {
    return new TokenUser(data as TokenUserData);
  }
}

type TokenUserData = AccessTokenPayload;
