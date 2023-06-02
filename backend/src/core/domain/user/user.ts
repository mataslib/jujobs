import {ObjectId} from 'mongodb';
import {comparePasswords, hashPassword} from '../../service/password';
import {universityAdvertiserId} from '../../shared/globals';
import {AdvertiserRegistration} from '../advertiserRegistration/advertiserRegistration';
import {IAuthorizableUser} from '../authorizableUser';
import {
  CreateUniversityAdminParams,
  UpdateUserParams,
  UserProps,
} from './schema';

export class User implements UserProps, IAuthorizableUser {
  public constructor(props: UserProps) {
    Object.assign(this, props);
  }
  _id!: ObjectId;
  email!: string;
  password!: string;
  passwordSalt!: string;
  roles!: ('advertiser' | 'admin' | 'student')[];
  advertiserId?: ObjectId;
  studentId?: ObjectId;
  createdAt!: Date;
  newJobNotificationSubscription?: {
    filter?: {
      fulltext?: string;
      place?: ('Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí')[];
      homeoffice?: boolean;
      legalType?: (
        | 'Dohoda o provedení práce'
        | 'Dohoda o provedení činnosti'
        | 'Pracovní smlouva'
        | 'OSVČ'
        | 'Stáž'
        | 'Praxe'
      )[];
      employmentType?: (
        | 'Plný úvazek'
        | 'Zkrácený úvazek'
        | 'Pracovní doba dle dohody'
      )[];
      durationType?: (
        | 'Krátkodobá'
        | 'Krátkodobá s možností navázaní spolupráce'
        | 'Dlouhodobá'
      )[];
    };
  };

  public async update(params: UpdateUserParams) {
    const {password, ...updateProps} = params;
    Object.assign(this, updateProps as UserProps);

    if (password) {
      const hashResult = await User.hashPassword(password);

      Object.assign(this, {
        password: hashResult.hashedPassword,
        passwordSalt: hashResult.salt,
      } as UserProps);
    }
  }

  public changeEmail(email: string) {
    this.email = email;
  }

  public static fromAdvertiserRegistration(
    advertiserRegistration: AdvertiserRegistration,
    advertiserId: ObjectId
  ) {
    const user = new User({
      _id: new ObjectId(),
      createdAt: new Date(),
      email: advertiserRegistration.email,
      password: advertiserRegistration.password,
      passwordSalt: advertiserRegistration.passwordSalt,
      roles: ['advertiser'],
      advertiserId: advertiserId,
    });

    return user;
  }

  public static async createUniversityAdmin(
    params: CreateUniversityAdminParams
  ) {
    const {password, ...createProps} = params;

    const hashResult = await User.hashPassword(password);

    return new User({
      ...createProps,
      _id: new ObjectId(),
      createdAt: new Date(),

      password: hashResult.hashedPassword,
      passwordSalt: hashResult.salt,
      // password: 'passwordNotSet',
      // passwordSalt: 'passwordNotSet',
      roles: ['admin', 'advertiser'],
      advertiserId: new ObjectId(universityAdvertiserId),
    });
  }

  public async isMyPassword(password: string) {
    const isPasswordMatch = await comparePasswords(
      password,
      this.password,
      this.passwordSalt
    );
    return isPasswordMatch;
  }

  public static async hashPassword(password: string) {
    return hashPassword(password);
  }

  public getUserId() {
    return this._id.toString();
  }
  public getAdvertiserId() {
    return this.advertiserId?.toString();
  }
  public getStudentId() {
    return this.studentId?.toString();
  }

  public hasRole(role: 'admin' | 'student' | 'advertiser'): boolean {
    return this.roles?.includes(role) ?? false;
  }

  public isTestUser() {
    return this.email === 'jujobstest@gmail.com';
  }
}
