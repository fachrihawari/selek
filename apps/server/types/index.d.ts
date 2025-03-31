import type { TUser } from '~/users/users.schema'; // Adjust path to your user entity

declare global {
  namespace Express {
    interface Request {
      user?: TUser; // Add other user properties as needed
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
