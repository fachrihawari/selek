import { Injectable } from '@nestjs/common';
import { sql } from '~/db/sql';
import { TCreateWorkspaceBody, TWorkspace } from './workspaces.schema';

@Injectable()
export class WorkspacesModel {
  async findManyByUserId(userId: string) {
    const workspaces = await sql<TWorkspace[]>`
      SELECT 
        w.id,
        w.name,
        w."logoUrl",
        w."ownerId"
      FROM workspaces w
      INNER JOIN workspace_members wm ON w.id = wm."workspaceId"
      WHERE wm."userId" = ${userId}
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
      const [workspace] = await sql<TWorkspace[]>`
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

      return workspace;
    });

    return workspace;
  }
}
