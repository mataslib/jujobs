import {z} from 'zod';

export const authenticateInputSchema = z.object({
  email: z.string().email().min(1, 'required'),
  password: z.string().min(1, 'required'),
});

export type AuthenticateInput = {
  password: string;
  email: string;
};
