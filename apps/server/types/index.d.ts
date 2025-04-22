import type { TUser, TUserSafe } from '~/users/users.schema'; // Adjust path to your user entity

declare global {
  namespace Express {
    interface Request {
      user?: TUserSafe; // Add other user properties as needed
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
    }
  }
}
