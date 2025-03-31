import { config } from 'dotenv';
import * as postgres from 'postgres';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const sql = postgres(process.env.DATABASE_URL!);
