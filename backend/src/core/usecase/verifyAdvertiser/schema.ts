import {z} from 'zod';

export const verifyAdvertiserInputSchema = z.object({
  token: z.string(),
});
export type VerifyAdvertiserInput = {
  token: string;
};
