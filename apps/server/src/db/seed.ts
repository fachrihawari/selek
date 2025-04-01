import { hash } from 'bcrypt';
import { sql } from './sql';
import { TUser } from '~/users/users.schema';
import { TWorkspace } from '~/workspaces/workspaces.schema';

async function seed() {
  // Seed users
  const users = [
    {
      full_name: 'fachri',
      email: 'fachri@mail.com',
      password: await hash('qweqwe', 10),
    },
    {
      full_name: 'budi',
      email: 'budi@mail.com',
      password: await hash('qweqwe', 10),
    },
    {
      full_name: 'udin',
      email: 'udin@mail.com',
      password: await hash('qweqwe', 10),
    },
  ];
  await sql`DELETE FROM users CASCADE`;
  const [fachri, budi, udin]: Pick<TUser, 'id'>[] = await sql`
    INSERT INTO users ${sql(users)} RETURNING id
  `;

  // Seed workspaces
  const workspaces = [
    {
      name: 'Hawari Dev',
      owner_id: fachri.id,
    },
    {
      name: 'Tangerang Dev',
      owner_id: budi.id,
    },
  ];
  await sql`DELETE FROM workspaces CASCADE`;
  const [hdWorkspace, tdWorkspace]: Pick<TWorkspace, 'id'>[] = await sql`
    INSERT INTO workspaces ${sql(workspaces)} RETURNING id
  `;

  // Seed workspace members
  const workspaceMembers = [
    {
      workspace_id: hdWorkspace.id,
      user_id: fachri.id,
      role: 'owner',
    },
    {
      workspace_id: tdWorkspace.id,
      user_id: budi.id,
      role: 'owner',
    },
    {
      workspace_id: tdWorkspace.id,
      user_id: fachri.id,
      role: 'member',
    },
    {
      workspace_id: hdWorkspace.id,
      user_id: udin.id,
      role: 'member',
    },
  ];
  await sql`DELETE FROM workspace_members CASCADE`;
  await sql`INSERT INTO workspace_members ${sql(workspaceMembers)}`;

  await sql.end();
  console.log(`Seeder done.`);
}

seed().catch(console.error);
