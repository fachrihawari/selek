import { Injectable } from '@nestjs/common';
import { sql } from '~/db/sql';
import { TWorkspace } from './workspaces.schema';

@Injectable()
export class WorkspacesModel {
  getUserWorkspaces(user_id: string) {
    const workspaces = sql<TWorkspace[]>`
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
}
