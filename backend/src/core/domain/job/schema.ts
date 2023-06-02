import type {ObjectId} from 'mongodb';
import {ArrayAtLeastOne} from 'shared/src/typeUtils';

export interface JobProps {
  _id: ObjectId;
  title: string;
  scope: string;
  text: string;
  requirements: string;
  benefits: string;
  salary?: string;
  place: 'Celá Česká republika' | 'Jižní Čechy' | 'Zahraničí';
  specificPlace: string;
  startDate: string;
  deadlineAt: Date;
  other?: string;
  legalType: ArrayAtLeastOne<
    | 'Dohoda o provedení práce'
    | 'Dohoda o provedení činnosti'
    | 'Pracovní smlouva'
    | 'OSVČ'
    | 'Stáž'
    | 'Praxe'
  >;
  durationType: ArrayAtLeastOne<
    'Krátkodobá' | 'Krátkodobá s možností navázaní spolupráce' | 'Dlouhodobá'
  >;
  employmentType: ArrayAtLeastOne<
    'Plný úvazek' | 'Zkrácený úvazek' | 'Pracovní doba dle dohody'
  >;
  fieldTypes: ArrayAtLeastOne<
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
  homeoffice: boolean;
  approved: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  advertiser: {
    _id: ObjectId;
    name: string;
    logo?: string | null;
    about?: string | null;
    web?: string | null;
  };
  replyToEmail: string;
}

export type CreateJobParams = {
  title: string;
  scope: string;
  text: string;
  requirements: string;
  benefits: string;
  salary?: string;
  place: JobProps['place'];
  specificPlace: string;
  startDate: string;
  deadlineAt: Date;
  other?: string;
  legalType: JobProps['legalType'];
  durationType: JobProps['durationType'];
  employmentType: JobProps['employmentType'];
  fieldTypes: JobProps['fieldTypes'];
  facultyTypes?: JobProps['facultyTypes'];
  homeoffice: boolean;
  replyToEmail: string;
};

export type UpdateJobParams = {
  title?: string;
  scope?: string;
  text?: string;
  requirements?: string;
  benefits?: string;
  salary?: string;
  place?: JobProps['place'];
  specificPlace?: string;
  startDate?: string;
  deadlineAt?: Date;
  other?: string;
  legalType?: JobProps['legalType'];
  durationType?: JobProps['durationType'];
  employmentType?: JobProps['employmentType'];
  fieldTypes?: JobProps['fieldTypes'];
  facultyTypes?: JobProps['facultyTypes'];
  homeoffice?: boolean;
  replyToEmail?: string;
};
