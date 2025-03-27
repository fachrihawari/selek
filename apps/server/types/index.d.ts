import type { TUser } from 'src/user/user.schema'; // Adjust path to your user entity

declare global {
  namespace Express {
    interface Request {
      user?: TUser; // Add other user properties as needed
    }
  }
}
