import {ObjectId} from 'mongodb';
import {NotFoundError} from '../../shared/error';
import {isSameId} from '../../shared/sameId';
import {
  CreateStudyParams,
  StudentProps,
  UpdateStudentParams,
  UpdateStudyParams,
} from './schema';

export class Student implements StudentProps {
  public constructor(props: StudentProps) {
    Object.assign(this, props);
  }
  _id!: ObjectId;
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
      znamka: null | 'S' | '1' | '1,5' | '2' | '2,5' | '3' | 'N';
      nazevPredmetu: string; // 'Úvod do studia a života na VŠ';
      pocetKreditu: number;
    }[];

    dataSource: 'user' | 'stag';
  }[];
  linkedin?: string;
  cv?: string;

  public update(params: UpdateStudentParams) {
    Object.assign(this, params as StudentProps);
  }

  public createStudyFromStagImport(params: CreateStudyParams) {
    const study = {
      ...params,
      _id: new ObjectId(),
      dataSource: 'stag',
    } as const;

    this.studies = [...(this.studies ?? []), study];
  }

  public createStudyFromUserData(params: CreateStudyParams) {
    const study = {
      ...params,
      _id: new ObjectId(),
      dataSource: 'user',
    } as const;

    this.studies = [...(this.studies ?? []), study];
  }

  public updateStudy(studyId: ObjectId, updateStudyParams: UpdateStudyParams) {
    if (!this.studies) {
      throw new NotFoundError();
    }

    const studyIdx = this.studies.findIndex(study =>
      isSameId(study._id, studyId)
    );

    if (studyIdx === -1) {
      throw new NotFoundError();
    }

    const updatedStudy = {
      ...this.studies[studyIdx],
      ...updateStudyParams,
      dataSource: 'user',
    };

    this.studies[studyIdx] = updatedStudy;
  }

  public deleteStudy(studyId: string) {
    if (!this.studies) {
      throw new NotFoundError();
    }
    const studyIdx = this.studies?.findIndex(study => {
      return isSameId(study._id, studyId);
    });

    if (studyIdx === -1) {
      throw new NotFoundError();
    }

    delete this.studies[studyIdx];
  }
}
