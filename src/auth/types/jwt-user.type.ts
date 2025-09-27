export type JwtUser = {
  userId: string;
  username: string;
  role: 'ADMIN' | 'STAFF';
};
