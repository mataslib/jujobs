export type ITokenUser = {
  userId: string;
  roles: ("admin" | "advertiser" | "student")[];
  email: string;
  advertiserId?: string;
  studentId?: string;
};
