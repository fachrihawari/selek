import { Injectable } from '@nestjs/common';
import { TWorkspace } from './workspaces.schema';
import { WorkspacesModel } from './workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesModel: WorkspacesModel) {}
  async getWorkspaces(owner_id: string): Promise<TWorkspace[]> {
    return await this.workspacesModel.getUserWorkspaces(owner_id);
  }
}
