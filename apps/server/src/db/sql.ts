import 'dotenv/config';
import * as postgres from 'postgres';

export const sql = postgres(process.env.DATABASE_URL);
