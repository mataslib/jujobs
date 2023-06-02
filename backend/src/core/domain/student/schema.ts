import type {ObjectId} from 'mongodb';

export type StudentProps = {
  _id: ObjectId;
  studies?: {
    _id: ObjectId;

    // Aplikovana informatika
    nazevSp: string;

    // '0'navazujici,
    // '1'Univerzita 3. veku,
    // '2'Mezinarodne uznavany kurz,
    // '3'Celozivotni,
    // '4'Ostatni,
    // '6'Rigorozni,
    // '7'bakalarsky,
    // '8'magistersky,
    // '9'Doktorsky
    typSpKey: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9';

    // FEK: 'Ekonomická fakulta',
    // FFI: 'Filozofická fakulta',
    // FPE: 'Pedagogická fakulta',
    // FPR: 'Přírodovědecká fakulta',
    // FRO: 'Fakulta rybářství a ochrany vod',
    // FTE: 'Teologická fakulta',
    // FZE: 'Fakulta zemědělská a technologická',
    // FZS: 'Zdravotně sociální fakulta',
    fakultaSp: 'FEK' | 'FFI' | 'FPE' | 'FPR' | 'FRO' | 'FTE' | 'FZE' | 'FZS';

    predmetAbsolvoval?: {
      semestr: 'ZS' | 'LS';
      rok: string; // eg. 2019, 2020
      absolvoval: 'A' | 'N'; // 'N' pokud zatim neabsolvovano
      znamka?: null | 'S' | '1' | '1,5' | '2' | '2,5' | '3' | 'N';
      nazevPredmetu: string; // 'Úvod do studia a života na VŠ';
      pocetKreditu: number;
    }[];

    dataSource: 'user' | 'stag';
  }[];
  linkedin?: string;
  cv?: string;
};

export type UpdateStudentParams = {
  linkedin?: string;
  cv?: string;
};

export type CreateStudyParams = {
  // Aplikovana informatika
  nazevSp: string;
  typSpKey: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9';
  fakultaSp: 'FEK' | 'FFI' | 'FPE' | 'FPR' | 'FRO' | 'FTE' | 'FZE' | 'FZS';
  predmetAbsolvoval?: {
    nazevPredmetu: string; // 'Úvod do studia a života na VŠ';
    znamka?: null | 'S' | '1' | '1,5' | '2' | '2,5' | '3' | 'N';
    semestr: 'ZS' | 'LS';
    rok: string; // eg. 2019, 2020
    absolvoval: 'A' | 'N'; // 'N' pokud zatim neabsolvovano
    pocetKreditu: number;
  }[];
};
export type UpdateStudyParams = {
  nazevSp?: string;
  typSpKey?: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9';
  fakultaSp?: 'FEK' | 'FPR' | 'FPE' | 'FTE' | 'FRO' | 'FZE' | 'FFI' | 'FZS';
  predmetAbsolvoval?: {
    znamka?: null | '1' | '2' | '3' | 'S' | '1,5' | '2,5' | 'N';
    nazevPredmetu: string;
  }[];
};
