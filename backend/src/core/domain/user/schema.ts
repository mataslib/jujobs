import type {ObjectId} from 'mongodb';

export type UserProps = {
  _id: ObjectId;
  email: string;
  password: string;
  passwordSalt: string;
  roles: ('admin' | 'student' | 'advertiser')[];
  advertiserId?: ObjectId;
  studentId?: ObjectId;

  newJobNotificationSubscription?: {
    filter?: {
      fulltext?: string | null;
      place?: ('Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí')[] | null;
      homeoffice?: boolean | null;
      legalType?:
        | (
            | 'Dohoda o provedení práce'
            | 'Dohoda o provedení činnosti'
            | 'Pracovní smlouva'
            | 'OSVČ'
            | 'Stáž'
            | 'Praxe'
          )[]
        | null;
      employmentType?:
        | ('Plný úvazek' | 'Zkrácený úvazek' | 'Pracovní doba dle dohody')[]
        | null;
      durationType?:
        | (
            | 'Krátkodobá'
            | 'Krátkodobá s možností navázaní spolupráce'
            | 'Dlouhodobá'
          )[]
        | null;
    } | null;
  } | null;
  createdAt: Date;
};

export type CreateUniversityAdminParams = {
  email: string;
  password: string;
};

export type UpdateUserParams = {
  password?: string;
  newJobNotificationSubscription?: {
    filter?: {
      fulltext?: string | null;
      place?: ('Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí')[] | null;
      homeoffice?: boolean | null;
      legalType?:
        | (
            | 'Dohoda o provedení práce'
            | 'Dohoda o provedení činnosti'
            | 'Pracovní smlouva'
            | 'OSVČ'
            | 'Stáž'
            | 'Praxe'
          )[]
        | null;
      employmentType?:
        | ('Plný úvazek' | 'Zkrácený úvazek' | 'Pracovní doba dle dohody')[]
        | null;
      durationType?:
        | (
            | 'Krátkodobá'
            | 'Krátkodobá s možností navázaní spolupráce'
            | 'Dlouhodobá'
          )[]
        | null;
    } | null;
  } | null;
};
