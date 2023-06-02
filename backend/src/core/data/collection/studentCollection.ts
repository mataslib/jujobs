import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type StudentDocument = {
  _id: ObjectId;
  cv?: string;
  linkedin?: string;
  studies?: {
    _id: ObjectId;
    nazevSp: string;
    typSpKey: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9'; // '0'navazujici, '1'Univerzita 3. veku, '2'Mezinarodne uznavany kurz, '3'Celozivotni, '4'Ostatni, '6'Rigorozni, '7'bakalarsky, '8'magistersky, '9'Doktorsky;
    fakultaSp: // | 'CJZ'
    | 'FEK' // Ekonomická fakulta
      | 'FFI' // Filozofická fakulta
      | 'FPE' // Pedagogická fakulta
      | 'FPR' // Přírodovědecká fakulta
      | 'FRO' // Fakulta rybářství a ochrany vod
      | 'FTE' // Teologická fakulta
      | 'FZE' // Fakulta zemědělská a technologická
      | 'FZS'; // Zdravotně sociální fakulta
    // | 'HU' // Historicky ustav?
    // | 'REK' // Rektorat
    // | 'UFB' // Ustav fyzikalni biologie?
    // | 'VUR'; // Vyzknumny ustav rybarsky a hydrobiologicky?;
    dataSource: 'user' | 'stag';
    predmetAbsolvoval?: {
      semestr: 'ZS' | 'LS';
      rok: string;
      absolvoval: 'A' | 'N';
      znamka: 'N' | 'S' | '1' | '1,5' | '2' | '2,5' | '3' | null;
      nazevPredmetu: string;
      pocetKreditu: number;
    }[];
  }[];
};

export const studentCollection = mongoClient
  .db()
  .collection<StudentDocument>('student');
