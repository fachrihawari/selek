import { hash } from 'bcrypt';
import { sql } from './sql';
import { TUser } from '~/users/users.schema';
import { TWorkspace } from '~/workspaces/workspaces.schema';

async function seed() {
  await sql`DELETE FROM workspace_members`;
  await sql`DELETE FROM workspace_channels`;
  await sql`DELETE FROM workspaces`;
  await sql`DELETE FROM users`;

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
  const [hdWorkspace, tdWorkspace]: Pick<TWorkspace, 'id'>[] = await sql`
    INSERT INTO workspaces ${sql(workspaces)} RETURNING id
  `;

  // Seed workspace channels
  const channels = [
    {
      name: 'General',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      members: [fachri.id, udin.id],
    },
    {
      name: 'Random',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      members: [fachri.id, budi.id],
    }
  ];

  await sql`INSERT INTO workspace_channels ${sql(channels)}`;

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
  await sql`INSERT INTO workspace_members ${sql(workspaceMembers)}`;

  await sql.end();
  console.log(`Seeder done.`);
}

seed().catch(console.error);
