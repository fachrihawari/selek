import { hash } from 'bcrypt';
import { sql } from './sql';
import { TUser } from '~/users/users.schema';
import { TWorkspace } from '~/workspaces/workspaces.schema';

async function seed() {
  // Seed users
  const users = [
    {
      fullName: 'fachri',
      email: 'fachri@mail.com',
      password: await hash('qweqwe', 10),
    },
    {
      fullName: 'budi',
      email: 'budi@mail.com',
      password: await hash('qweqwe', 10),
    },
    {
      fullName: 'udin',
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
      ownerId: fachri.id,
    },
    {
      name: 'Tangerang Dev',
      ownerId: budi.id,
    },
  ];
  await sql`DELETE FROM workspaces CASCADE`;
  const [hdWorkspace, tdWorkspace]: Pick<TWorkspace, 'id'>[] = await sql`
    INSERT INTO workspaces ${sql(workspaces)} RETURNING id
  `;

  // Seed workspace members
  const workspaceMembers = [
    {
      workspaceId: hdWorkspace.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      workspaceId: tdWorkspace.id,
      userId: budi.id,
      role: 'owner',
    },
    {
      workspaceId: tdWorkspace.id,
      userId: fachri.id,
      role: 'member',
    },
    {
      workspaceId: hdWorkspace.id,
      userId: udin.id,
      role: 'member',
    },
  ];
  await sql`DELETE FROM workspace_members CASCADE`;
  await sql`INSERT INTO workspace_members ${sql(workspaceMembers)}`;

  await sql.end();
  console.log(`Seeder done.`);
}

seed().catch(console.error);
