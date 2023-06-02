import {ObjectId} from 'mongodb';
import {ArrayAtLeastOne} from 'shared/src/typeUtils';
import {Advertiser} from '../advertiser/advertiser';
import {TokenUser} from '../tokenUser/tokenUser';
import {CreateJobParams, JobProps, UpdateJobParams} from './schema';

export class Job implements JobProps {
  _id!: ObjectId;
  title!: string;
  scope!: string;
  text!: string;
  requirements!: string;
  benefits!: string;
  salary?: string;
  place!: 'Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí';
  specificPlace!: string;
  startDate!: string;
  deadlineAt!: Date;
  other?: string;
  legalType!: ArrayAtLeastOne<
    | 'Dohoda o provedení práce'
    | 'Dohoda o provedení činnosti'
    | 'Pracovní smlouva'
    | 'OSVČ'
    | 'Stáž'
    | 'Praxe'
  >;
  durationType!: ArrayAtLeastOne<
    'Krátkodobá' | 'Krátkodobá s možností navázaní spolupráce' | 'Dlouhodobá'
  >;
  employmentType!: ArrayAtLeastOne<
    'Plný úvazek' | 'Zkrácený úvazek' | 'Pracovní doba dle dohody'
  >;
  fieldTypes!: ArrayAtLeastOne<
    | 'Administrativa'
    | 'Doprava'
    | 'Finance'
    | 'Informační technologie'
    | 'Kultura a sport'
    | 'Management'
    | 'Obchod a cestovní ruch'
    | 'Obrana a ochrana'
    | 'Právo'
    | 'Služby'
    | 'Stavebnictví'
    | 'Věda a výzkum'
    | 'Výchova a vzdělávání'
    | 'Výroba a provoz'
    | 'Zdravotnictví'
    | 'Zemědělství a lesnictví'
    | 'Jiné'
  >;
  facultyTypes?: (
    | 'Ekonomická'
    | 'Přírodovědecká'
    | 'Pedagogická'
    | 'Teologická'
    | 'Rybářství a ochrany vod'
    | 'Zemědělská a technologická'
    | 'Filozofická'
    | 'Zdravotně sociální'
  )[];
  homeoffice!: boolean;
  approved!: boolean;
  archived!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  advertiser!: {
    _id: ObjectId;
    name: string;
    logo?: string | null;
    about?: string | null;
    web?: string | null;
  };
  replyToEmail!: string;

  public constructor(props: JobProps) {
    Object.assign(this, props);
  }

  public approve() {
    this.approved = true;
    this.updatedAt = new Date();
  }

  public archive() {
    this.archived = true;
    this.updatedAt = new Date();
  }
  public static create(
    createParams: CreateJobParams,
    advertiser: Advertiser,
    currentUser: TokenUser
  ) {
    return new Job({
      ...createParams,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      advertiser: {
        _id: advertiser._id,
        web: advertiser.web,
        logo: advertiser.logo,
        name: advertiser.name,
      },
      approved:
        currentUser.hasRole('admin') || currentUser.isTestUser() ? true : false,
      archived: false,
    });
  }

  public update(
    updateParams: UpdateJobParams,
    advertiser: Advertiser,
    currentUser: TokenUser
  ) {
    const props = {
      ...updateParams,
      updatedAt: new Date(),
      advertiser: {
        _id: advertiser._id,
        web: advertiser.web,
        logo: advertiser.logo,
        name: advertiser.name,
      },
      // If user is admin, then approved state is preserved,
      // otherwise it is set to false and job need to be approved
      approved:
        currentUser.hasRole('admin') || currentUser.isTestUser()
          ? this.approved
          : false,
    } as JobProps;

    Object.assign(this, props);
  }
}
