import { Injectable } from '@nestjs/common';
import { TCreateWorkspaceBody, TWorkspace } from './workspaces.schema';
import { WorkspacesModel } from './workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesModel: WorkspacesModel) {}
  async getWorkspaces(owner_id: string): Promise<TWorkspace[]> {
    return await this.workspacesModel.findManyByUserId(owner_id);
  }

  async createWorkspace(
    owner_id: string,
    workspace: TCreateWorkspaceBody,
  ): Promise<TWorkspace> {
    return await this.workspacesModel.create(owner_id, workspace);
  }
}
