export type IAuthorizableUser = {
  hasRole(role: 'admin' | 'student' | 'advertiser'): boolean;
  isTestUser(): boolean;
  getUserId: () => string;
  getAdvertiserId: () => string | undefined;
  getStudentId: () => string | undefined;
};
