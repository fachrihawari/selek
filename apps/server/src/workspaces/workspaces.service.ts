import { Injectable } from '@nestjs/common';
import { TCreateWorkspaceBody, TWorkspace } from './workspaces.schema';
import { WorkspacesModel } from './workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesModel: WorkspacesModel) {}
  async getWorkspaces(ownerId: string): Promise<TWorkspace[]> {
    return await this.workspacesModel.findManyByUserId(ownerId);
  }

  async createWorkspace(
    ownerId: string,
    workspace: TCreateWorkspaceBody,
  ): Promise<TWorkspace> {
    return await this.workspacesModel.create(ownerId, workspace);
  }
}
