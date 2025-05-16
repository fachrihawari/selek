import { hash } from 'bcrypt';
import { sql } from './sql';
import { TUser } from '~/users/users.schema';
import { TWorkspace } from '~/workspaces/workspaces.schema';

async function seed() {
  await sql`DELETE FROM conversation_messages`;
  await sql`DELETE FROM conversation_members`;
  await sql`DELETE FROM conversations`;
  await sql`DELETE FROM workspace_members`;
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

  // Seed workspace members
  const workspaceMembers = [
    // HD workspace
    {
      workspaceId: hdWorkspace.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      workspaceId: hdWorkspace.id,
      userId: udin.id,
      role: 'member',
    },
    {
      workspaceId: hdWorkspace.id,
      userId: budi.id,
      role: 'member',
    },

    // TD workspace
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
  ];
  await sql`INSERT INTO workspace_members ${sql(workspaceMembers)}`;

  // Seed conversations
  const conversations = [
    {
      name: 'General',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      type: 'channel',
    },
    {
      name: 'Random',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      type: 'channel',
    },
    {
      name: 'Budi, Fachri, Udin',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      type: 'group',
    },
    {
      name: 'Fachri, Udin',
      workspaceId: hdWorkspace.id,
      ownerId: fachri.id,
      type: 'dm',
    },
  ];

  const [generalChannel, randomChannel, group, dm] = await sql`
    INSERT INTO conversations ${sql(conversations)}
    RETURNING id
  `;

  const conversationMembers = [
    {
      conversationId: generalChannel.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      conversationId: generalChannel.id,
      userId: udin.id,
      role: 'member',
    },
    {
      conversationId: randomChannel.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      conversationId: randomChannel.id,
      userId: budi.id,
      role: 'member',
    },
    {
      conversationId: group.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      conversationId: group.id,
      userId: budi.id,
      role: 'member',
    },
    {
      conversationId: group.id,
      userId: udin.id,
      role: 'member',
    },
    {
      conversationId: dm.id,
      userId: fachri.id,
      role: 'owner',
    },
    {
      conversationId: dm.id,
      userId: udin.id,
      role: 'member',
    },
  ];
  await sql`
    INSERT INTO conversation_members ${sql(conversationMembers)}
  `;

  const messages = [
    {
      conversationId: generalChannel.id,
      senderId: fachri.id,
      content: 'Hi everyone',
    },
    {
      conversationId: generalChannel.id,
      senderId: udin.id,
      content: 'yo fachri',
    },
  ];

  for (let seq = 1; seq < 100; seq++) {
    const element = {
      conversationId: randomChannel.id,
      senderId: fachri.id,
      content: 'Msg seq: ' + seq,
    };
    await sql`
      INSERT INTO conversation_messages ${sql(element)}
    `;
  }

  await sql`
    INSERT INTO conversation_messages ${sql(messages)}
  `;

  await sql.end();
  console.log(`Seeder done.`);
}

seed().catch(console.error);
