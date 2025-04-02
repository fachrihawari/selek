import { config } from 'dotenv';
import * as postgres from 'postgres';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const sql = postgres(process.env.DATABASE_URL);
