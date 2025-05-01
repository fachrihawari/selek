import { Injectable } from '@nestjs/common';
import { TCreateWorkspaceBody } from './workspaces.schema';
import { WorkspacesModel } from './workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesModel: WorkspacesModel) {}
  async getWorkspaces(ownerId: string) {
    return await this.workspacesModel.findManyByUserId(ownerId);
  }

  async getWorkspace(workspaceId: string) {
    return await this.workspacesModel.findById(workspaceId);
  }

  async isWorkspaceMember(userId: string, workspaceId: string) {
    return await this.workspacesModel.isMember(userId, workspaceId);
  }

  async createWorkspace(ownerId: string, workspace: TCreateWorkspaceBody) {
    return await this.workspacesModel.create(ownerId, workspace);
  }

  async getConversations(workspaceId: string, type: 'channels' | 'dms' | 'group' = 'channels') {
    return await this.workspacesModel.getConversations(workspaceId, type);
  }
}
