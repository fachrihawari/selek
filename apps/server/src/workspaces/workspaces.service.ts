import { Injectable } from '@nestjs/common';
import {
  AddWorkspaceMemberDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from './workspaces.schema';
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

  async addWorkspaceMember(workspaceId: string, body: AddWorkspaceMemberDto) {
    return await this.workspacesModel.addMember(workspaceId, body);
  }

  async deleteWorkspaceMember(workspaceId: string, userId: string) {
    return await this.workspacesModel.deleteMember(workspaceId, userId);
  }

  async findWorkspaceMember(userId: string, workspaceId: string) {
    return await this.workspacesModel.findMember(userId, workspaceId);
  }

  async createWorkspace(ownerId: string, workspace: CreateWorkspaceDto) {
    return await this.workspacesModel.create(ownerId, workspace);
  }

  async updateWorkspace(workspaceId: string, updateData: UpdateWorkspaceDto) {
    return await this.workspacesModel.updateById(workspaceId, updateData);
  }

}
