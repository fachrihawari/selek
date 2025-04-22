import { Injectable } from '@nestjs/common';
import { sql } from '~/db/sql';
import { TCreateWorkspaceBody, TWorkspace, TWorkspaceChannelsQueryResult, TWorkspacesQueryResult } from './workspaces.schema';

@Injectable()
export class WorkspacesModel {
  async findManyByUserId(userId: string) {
    const workspaces = await sql<TWorkspacesQueryResult[]>`
      SELECT 
        w.id,
        w.name,
        w."logoUrl",
        w."ownerId",
        COUNT(DISTINCT wm2."userId")::int as "memberCount"
      FROM workspaces w
      INNER JOIN workspace_members wm ON w.id = wm."workspaceId"
      LEFT JOIN workspace_members wm2 ON w.id = wm2."workspaceId"
      WHERE wm."userId" = ${userId}
      GROUP BY w.id, w.name, w."logoUrl", w."ownerId"
      ORDER BY w."createdAt" DESC
    `;

    return workspaces;
  }

  async create(ownerId: string, { name, logoUrl }: TCreateWorkspaceBody) {
    const workspace = await sql.begin(async (sql) => {
      // Insert workspace
      const worksapceValue = {
        name,
        logoUrl,
        ownerId,
      };
      const [workspace] = await sql<TWorkspacesQueryResult[]>`
        INSERT INTO workspaces ${sql(worksapceValue)}
        RETURNING id, name, "logoUrl", "ownerId"
      `;

      // Insert workspace members
      const workspaceMembersValue = {
        workspaceId: workspace.id,
        userId: ownerId,
        role: 'owner',
      };
      await sql` INSERT INTO workspace_members ${sql(workspaceMembersValue)}`;

      // Hardcode member count, cause we only have one member for newly created workspace
      workspace.memberCount = 1;

      return workspace;
    });

    return workspace;
  }
  async isMember(userId: string, workspaceId: string) {
    const [workspace] = await sql<{ joinedAt: string }[]>`
      SELECT "joinedAt"
      FROM workspace_members
      WHERE "userId" = ${userId} AND "workspaceId" = ${workspaceId}
    `;
    return Boolean(workspace);
  }

  async findById(workspaceId: string) {
    const [workspace] = await sql<TWorkspacesQueryResult[]>`
      SELECT
        id,
        name,
        "logoUrl",
        "ownerId"
      FROM workspaces 
      where id = ${workspaceId}
    `;
    return workspace;
  }

  async getChannels(workspaceId: string) {
    const channels = await sql<TWorkspaceChannelsQueryResult[]>`
      SELECT 
        c.id,
        c.name,
      FROM workspace_channels c
      WHERE c."workspaceId" = ${workspaceId}
    `;
    return channels;
  }
}
