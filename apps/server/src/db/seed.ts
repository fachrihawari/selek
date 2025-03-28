import 'dotenv/config';
import { hash } from 'bcrypt';
import { sql } from './sql';

async function seed() {
  await sql`DELETE FROM users`;

  const user = {
    full_name: 'ai',
    email: 'ai@mail.com',
    password: await hash('ai', 10),
  };

  await sql`INSERT INTO users ${sql(user)}`;

  console.info(`Seeder done.`);

  await sql.end();
  process.exit(0);
}

seed().catch(console.error);
