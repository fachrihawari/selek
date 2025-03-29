import { hash } from 'bcrypt';
import { sql } from './sql';

async function seed() {
  // Seed users
  const user = {
    full_name: 'ai',
    email: 'ai@mail.com',
    password: await hash('ai', 10),
  };
  await sql`DELETE FROM users`;
  const [{ id: userId }] = await sql`INSERT INTO users ${sql(user)} RETURNING id`;

  // Seed workspaces
  const workspaces = [
    {
      name: 'Hacktiv8',
      owner_id: userId,
    },
    {
      name: 'Code Play Indonesia',
      owner_id: userId,
    },
  ];
  await sql`DELETE FROM workspaces`;
  await sql`INSERT INTO workspaces ${sql(workspaces, 'name', 'owner_id')}`;

  await sql.end();
  console.log(`Seeder done.`);
}

seed().catch(console.error);
