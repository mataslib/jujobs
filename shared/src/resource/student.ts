export type IStudentReadModel = {
  // Student
  _id: string;
  linkedin?: string;
  cv?: string;

  studies?: {
    // Study
    _id: string;
    nazevSp: string;
    typSpKey: "0" | "1" | "2" | "3" | "4" | "6" | "7" | "8"; // '0'navazujici, '1'Univerzita 3. veku, '2'Mezinarodne uznavany kurz, '3'Celozivotni, '4'Ostatni, '6'Rigorozni, '7'bakalarsky, '8'magistersky, '9'Doktorsky
    fakultaSp:
      | "CJZ"
      | "FEK" // Ekonomická fakulta
      | "FFI" // Filozofická fakulta
      | "FPE" // Pedagogická fakulta
      | "FPR" // Přírodovědecká fakulta
      | "FRO" // Fakulta rybářství a ochrany vod
      | "FTE" // Teologická fakulta
      | "FZE" // Fakulta zemědělská a technologická
      | "FZS" // Zdravotně sociální fakulta
      | "HU" // Historicky ustav?
      | "REK" // Rektorat
      | "UFB" // Ustav fyzikalni biologie?
      | "VUR"; // Vyzknumny ustav rybarsky a hydrobiologicky?
    dataSource: "user" | "stag";
    predmetAbsolvoval?: {
      semestr: "ZS" | "LS";
      rok: string;
      absolvoval: "A" | "N";
      znamka: "N" | "S" | "1" | "1,5" | "2" | "2,5" | "3" | null;
      nazevPredmetu: string;
      pocetKreditu: number;
    }[];
  }[];
};

// export type IStudentWriteModel = {};

// export type ISearchStudent = {
//   fulltext?: string;
//   homeoffice?: boolean;
//   place?: ("Celá Česká republika" | "Jižní Čechy" | "Zahraničí")[];
//   employmentType?: (
//     | "Plný úvazek"
//     | "Zkrácený úvazek"
//     | "Pracovní doba dle dohody"
//   )[];
//   legalType?: (
//     | "Dohoda o provedení práce"
//     | "Dohoda o provedení činnosti"
//     | "Pracovní smlouva"
//     | "OSVČ"
//     | "Stáž"
//     | "Praxe"
//   )[];
//   durationType?: (
//     | "Krátkodobá"
//     | "Krátkodobá s možností navázaní spolupráce"
//     | "Dlouhodobá"
//   )[];
//   advertiserId?: string;
//   approved?: boolean;
//   archived?: boolean;
// };
