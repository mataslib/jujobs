import {z} from 'zod';

export const resetForgottenPasswordInputSchema = z.object({
  password: z.string().min(8, `Alespoň 8 znaků`),
  token: z.string().min(1, 'required'),
});
export type ResetForgottenPasswordInput = {
  password: string;
  token: string;
};
