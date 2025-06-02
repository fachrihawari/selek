import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspaces.schema';
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

  async getWorkspaceMembers(workspaceId: string) {
    return await this.workspacesModel.getMembers(workspaceId);
  }

  async isWorkspaceMember(userId: string, workspaceId: string) {
    return await this.workspacesModel.isMember(userId, workspaceId);
  }

  async createWorkspace(ownerId: string, workspace: CreateWorkspaceDto) {
    return await this.workspacesModel.create(ownerId, workspace);
  }

  async updateWorkspace(workspaceId: string, updateData: UpdateWorkspaceDto) {
    return await this.workspacesModel.updateById(workspaceId, updateData);
  }

  async isWorkspaceOwner(userId: string, workspaceId: string) {
    return await this.workspacesModel.isOwner(userId, workspaceId);
  }
}
