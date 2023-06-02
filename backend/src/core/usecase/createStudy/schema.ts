import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const createStudyInputSchema = z.object({
  studentId: z.string().transform(val => new ObjectId(val)),

  nazevSp: z.string().min(1, 'required'),
  fakultaSp: z.union([
    z.literal('FEK'),
    z.literal('FPR'),
    z.literal('FPE'),
    z.literal('FTE'),
    z.literal('FRO'),
    z.literal('FZE'),
    z.literal('FFI'),
    z.literal('FZS'),
  ]),
  typSpKey: z.union([
    z.literal('0'),
    z.literal('1'),
    z.literal('2'),
    z.literal('3'),
    z.literal('4'),
    z.literal('6'),
    z.literal('7'),
    z.literal('8'),
    z.literal('9'),
  ]),
  predmetAbsolvoval: z.array(
    z.object({
      znamka: z.union([
        z.literal('S'),
        z.literal('1'),
        z.literal('1,5'),
        z.literal('2'),
        z.literal('2,5'),
        z.literal('3'),
        z.literal('N'),
      ]),
      nazevPredmetu: z.string(),
      // semestr: z
      //   .union([z.literal(semestrType.winter), z.literal(semestrType.summer)])
      //   .optional(),
      // rok: z.string().optional(),
      // absolvoval: z
      //   .union([z.literal(absolvovalType.yes), z.literal(absolvovalType.no)])
      //   .optional(),
    })
  ),
});

export type CreateStudyInput = {
  studentId: string;
  nazevSp: string;
  fakultaSp: 'FEK' | 'FPR' | 'FPE' | 'FTE' | 'FRO' | 'FZE' | 'FFI' | 'FZS';
  typSpKey: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9';
  predmetAbsolvoval: {
    znamka: '1' | '2' | '3' | 'S' | '1,5' | '2,5' | 'N';
    nazevPredmetu: string;
  }[];
};
