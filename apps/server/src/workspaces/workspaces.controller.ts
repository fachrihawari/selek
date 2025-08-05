import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AuthGuard } from '~/auth/auth.guard';
import { AuthUser } from '~/auth/auth-user.decorator';
import { TUserSafe } from '~/users/users.schema';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import {
  CreateWorkspaceSchema,
  CreateWorkspaceDto,
  UpdateWorkspaceSchema,
  UpdateWorkspaceDto,
  AddWorkspaceMemberSchema,
  AddWorkspaceMemberDto,
} from './workspaces.schema';
import { WorkspaceGuard } from './workspaces.guard';
import { WorkspaceOwnerGuard } from './workspaces-owner.guard';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(@AuthUser() user: TUserSafe) {
    return await this.workspacesService.getWorkspaces(user.id);
  }

  @Get('/:workspaceId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WorkspaceGuard)
  async getWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.workspacesService.getWorkspace(workspaceId);
  }

  @Get('/:workspaceId/members')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WorkspaceGuard)
  async getWorkspaceMembers(@Param('workspaceId') workspaceId: string) {
    return await this.workspacesService.getWorkspaceMembers(workspaceId);
  }

  @Post('/:workspaceId/members')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(WorkspaceGuard)
  async addWorkspaceMember(
    @Param('workspaceId') workspaceId: string,
    @Body(new ZodValidationPipe(AddWorkspaceMemberSchema))
    body: AddWorkspaceMemberDto,
  ) {
    return await this.workspacesService.addWorkspaceMember(workspaceId, body);
  }

  @Delete('/:workspaceId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WorkspaceGuard)
  async deleteWorkspaceMember(
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return await this.workspacesService.deleteWorkspaceMember(
      workspaceId,
      userId,
    );
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @AuthUser() user: TUserSafe,
    @Body(new ZodValidationPipe(CreateWorkspaceSchema))
    body: CreateWorkspaceDto,
  ) {
    return await this.workspacesService.createWorkspace(user.id, body);
  }

  @Patch('/:workspaceId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WorkspaceGuard, WorkspaceOwnerGuard)
  async updateWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body(new ZodValidationPipe(UpdateWorkspaceSchema))
    body: UpdateWorkspaceDto,
  ) {
    return await this.workspacesService.updateWorkspace(workspaceId, body);
  }
}
