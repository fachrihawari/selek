import { Injectable } from '@nestjs/common';
import { sql } from '~/db/sql';
import { TCreateWorkspaceBody, TWorkspace } from './workspaces.schema';

@Injectable()
export class WorkspacesModel {
  async findManyByUserId(user_id: string) {
    const workspaces = await sql<TWorkspace[]>`
      SELECT 
        w.id,
        w.name,
        w.logo_url,
        w.owner_id,
        w.created_at,
        w.updated_at
      FROM workspaces w
      INNER JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = ${user_id}
      ORDER BY w.created_at DESC
    `;

    return workspaces;
  }

  async create(owner_id: string, { name, logo_url }: TCreateWorkspaceBody) {
    const workspace = await sql.begin(async (sql) => {
      const [workspace] = await sql<TWorkspace[]>`
        INSERT INTO workspaces (name, logo_url, owner_id)
        VALUES (${name}, ${logo_url ?? ''}, ${owner_id})
        RETURNING id, name, logo_url, owner_id
      `;

      await sql`
        INSERT INTO workspace_members (workspace_id, user_id, role)
        VALUES (${workspace.id}, ${owner_id}, 'owner')
      `;

      return workspace;
    });

    return workspace;
  }
}
