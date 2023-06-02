import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const importStagStudySchema = z.object({
  stagUserTicket: z.string().min(1, 'required'),
  studentId: z.string().transform(val => new ObjectId(val)),
});
export type ImportStagStudyInput = {
  studentId: string;
  stagUserTicket: string;
};
