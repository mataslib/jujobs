export type IUserReadModel = {
  _id: string;
  email: string;
  roles: ("admin" | "student" | "advertiser")[];
  advertiserId?: string;
  studentId?: string;

  newJobNotificationSubscription?: {
    filter?: {
      fulltext?: string | null;
      place?: ("Celá Česká republika" | "Jižní Čechy" | "Zahraničí")[] | null;
      homeoffice?: boolean | null;
      legalType?:
        | (
            | "Dohoda o provedení práce"
            | "Dohoda o provedení činnosti"
            | "Pracovní smlouva"
            | "OSVČ"
            | "Stáž"
            | "Praxe"
          )[]
        | null;
      employmentType?:
        | ("Plný úvazek" | "Zkrácený úvazek" | "Pracovní doba dle dohody")[]
        | null;
      durationType?:
        | (
            | "Krátkodobá"
            | "Krátkodobá s možností navázaní spolupráce"
            | "Dlouhodobá"
          )[]
        | null;
    } | null;
  } | null;
  createdAt: string;
};
