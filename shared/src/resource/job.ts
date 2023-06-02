import { ArrayAtLeastOne } from "../typeUtils";

export type IJobReadModel = {
  _id: string;
  advertiser: {
    _id: string;
    name: string;
    logo?: string;
    about?: string;
    web?: string;
  };
  createdAt: string;
  updatedAt: string;
  approved: boolean;
  archived: boolean;

  title: string;
  scope: string;
  text: string;
  requirements: string;
  benefits: string;
  salary?: string;
  place: "Celá Česká republika" | "Jižní Čechy" | "Zahraničí";
  specificPlace: string;
  startDate: string;
  deadlineAt: string;
  other?: string;
  legalType: ArrayAtLeastOne<
    | "Dohoda o provedení práce"
    | "Dohoda o provedení činnosti"
    | "Pracovní smlouva"
    | "OSVČ"
    | "Stáž"
    | "Praxe"
  >;
  durationType: ArrayAtLeastOne<
    "Krátkodobá" | "Krátkodobá s možností navázaní spolupráce" | "Dlouhodobá"
  >;
  employmentType: ArrayAtLeastOne<
    "Plný úvazek" | "Zkrácený úvazek" | "Pracovní doba dle dohody"
  >;
  fieldTypes: ArrayAtLeastOne<
    | "Administrativa"
    | "Doprava"
    | "Finance"
    | "Informační technologie"
    | "Kultura a sport"
    | "Management"
    | "Obchod a cestovní ruch"
    | "Obrana a ochrana"
    | "Právo"
    | "Služby"
    | "Stavebnictví"
    | "Věda a výzkum"
    | "Výchova a vzdělávání"
    | "Výroba a provoz"
    | "Zdravotnictví"
    | "Zemědělství a lesnictví"
    | "Jiné"
  >;
  facultyTypes?: (
    | "Ekonomická"
    | "Přírodovědecká"
    | "Pedagogická"
    | "Teologická"
    | "Rybářství a ochrany vod"
    | "Zemědělská a technologická"
    | "Filozofická"
    | "Zdravotně sociální"
  )[];
  homeoffice: boolean;

  replyToEmail: string;
};

export type JobSearch = {
  _id?: string;
  advertiserId?: string;
  fulltext?: string;
  homeoffice?: boolean;
  employmentType?: (
    | "Plný úvazek"
    | "Zkrácený úvazek"
    | "Pracovní doba dle dohody"
  )[];
  legalType?: (
    | "Dohoda o provedení práce"
    | "Dohoda o provedení činnosti"
    | "Pracovní smlouva"
    | "OSVČ"
    | "Stáž"
    | "Praxe"
  )[];
  durationType?: (
    | "Krátkodobá"
    | "Krátkodobá s možností navázaní spolupráce"
    | "Dlouhodobá"
  )[];
  place?: ("Celá Česká republika" | "Jižní Čechy" | "Zahraničí")[];
  approved?: boolean;
  archived?: boolean;
};
