export type JwtPayload = {
  sub: string; // user._id
  username: string;
  role: 'ADMIN' | 'STAFF';
};
