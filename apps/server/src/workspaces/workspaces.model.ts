import { Injectable } from '@nestjs/common';
import { sql } from '~/db/sql';
import {
  AddWorkspaceMemberDto,
  CreateWorkspaceDto,
  TWorkspaceQueryResult,
  UpdateWorkspaceDto,
} from './workspaces.schema';

@Injectable()
export class WorkspacesModel {
  async findManyByUserId(userId: string) {
    const workspaces = await sql<TWorkspaceQueryResult[]>`
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

  async create(ownerId: string, { name, logoUrl }: CreateWorkspaceDto) {
    const workspace = await sql.begin(async (sql) => {
      // Insert workspace
      const worksapceValue = {
        name,
        logoUrl,
        ownerId,
      };
      const [workspace] = await sql<TWorkspaceQueryResult[]>`
        INSERT INTO workspaces ${sql(worksapceValue)}
        RETURNING id, name, "logoUrl", "ownerId", 1 AS "memberCount"
      `;

      // Insert workspace members
      const workspaceMembersValue = {
        workspaceId: workspace.id,
        userId: ownerId,
        role: 'owner',
      };
      await sql` INSERT INTO workspace_members ${sql(workspaceMembersValue)}`;

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
    const [workspace] = await sql<TWorkspaceQueryResult[]>`
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

  async deleteMember(workspaceId: string, userId: string) {
    const result = await sql`
      DELETE FROM workspace_members
      WHERE "workspaceId" = ${workspaceId} AND "userId" = ${userId}
      RETURNING "userId"
    `;
    return result.length > 0;
  }

  async addMember(workspaceId: string, { email, role }: AddWorkspaceMemberDto) {
    const [user] = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const workspaceMemberValue = {
      workspaceId,
      userId: user.id,
      role,
      joinedAt: new Date(),
    };
    await sql`INSERT INTO workspace_members ${sql(workspaceMemberValue)}`;

    return { userId: user.id, workspaceId };
  }

  async getMembers(workspaceId: string) {
    const members = await sql`
      SELECT 
        u.id,
        u.email,
        u."fullName",
        u."avatarUrl",
        wm.role,
        wm."joinedAt"
      FROM workspace_members wm
      INNER JOIN users u ON wm."userId" = u.id
      WHERE wm."workspaceId" = ${workspaceId}
      ORDER BY u."fullName" ASC
    `;
    return members;
  }

  async updateById(workspaceId: string, updateData: UpdateWorkspaceDto) {
    const updatedFields = {
      ...updateData,
      updatedAt: new Date(),
    };

    const [workspace] = await sql<TWorkspaceQueryResult[]>`
      UPDATE workspaces 
      SET ${sql(updatedFields)}
      WHERE id = ${workspaceId}
      RETURNING id, name, "logoUrl", "ownerId"
    `;

    return workspace;
  }

  async isOwner(userId: string, workspaceId: string) {
    const [workspace] = await sql<{ ownerId: string }[]>`
      SELECT "ownerId"
      FROM workspaces
      WHERE id = ${workspaceId} AND "ownerId" = ${userId}
    `;
    return Boolean(workspace);
  }
}
