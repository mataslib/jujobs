import {z} from 'zod';

export const verifyEmailChangeInputSchema = z.object({
  token: z.string(),
});
export type VerifyEmailChangeInput = {
  token: string;
};
