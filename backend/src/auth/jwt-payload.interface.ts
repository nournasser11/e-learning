export interface JwtPayload {
    email: string;
    sub: string; // The user's _id
    role: string; // The user's role
  }