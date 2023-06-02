export type SubscribeToNewJobNotificationRequestBody = {
  userId: string;
  filter?: // Job filter
  {
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
};
export type SubscribeToNewJobNotificationResultBody = void;
