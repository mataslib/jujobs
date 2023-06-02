import {z} from 'zod';

export const registerAdvertiserInputSchema = z.object({
  name: z.string().min(1, `povinné`),
  email: z.string().min(1, `required`).email(),
  password: z.string().min(8, `Alespoň 8 znaků`),
  verifyUrl: z.string().url().min(1, `povinné`),
});

export type RegisterAdvertiserInput = {
  name: string;
  email: string;
  password: string;
  verifyUrl: string;
};
