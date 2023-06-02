import type {JWTVerifyResult} from 'jose';
import {createSignedToken, verifySignedToken} from './token';

export async function createAccessToken(data: {
  payload: UserTokenPayload;
  createdAt: Date;
  expiresAt: Date;
}) {
  const {payload, createdAt, expiresAt} = data;
  const signedAccessToken = createSignedToken(payload, createdAt, expiresAt);
  return signedAccessToken;
}

export async function verifyAccessToken(stringToken: string) {
  return verifySignedToken(stringToken) as Promise<VerifyResult>;
}

export type UserTokenPayload = {
  userId: string;
  email: string;
  roles: ('admin' | 'student' | 'advertiser')[];
  advertiserId?: string;
  studentId?: string;
};

export type AccessTokenPayload = JWTVerifyResult['payload'] & UserTokenPayload;

export type VerifyResult = JWTVerifyResult & {
  payload: AccessTokenPayload;
};
