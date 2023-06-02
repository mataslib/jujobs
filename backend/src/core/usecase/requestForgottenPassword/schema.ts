import {z} from 'zod';

export const forgottenPasswordRequestInputSchema = z.object({
  email: z.string().email(),
  changePasswordUrl: z.string().url(),
});

export type RequestForgottenPasswordInput = {
  changePasswordUrl: string;
  email: string;
};
