import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AuthGuard } from '~/auth/auth.guard';
import { AuthUser } from '~/auth/auth-user.decorator';
import { TUserSafe } from '~/users/users.schema';
import { ZodValidationPipe } from '~/shared/zod-validation.pipe';
import {
  CreateWorkspaceBodySchema,
  TCreateWorkspaceBody,
} from './workspaces.schema';
import { WorkspaceGuard } from './workspaces.guard';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(@AuthUser() user: TUserSafe) {
    return await this.workspacesService.getWorkspaces(user.id);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WorkspaceGuard)
  async getWorkspace(@Param('id') workspaceId: string) {
    return await this.workspacesService.getWorkspace(workspaceId);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @AuthUser() user: TUserSafe,
    @Body(new ZodValidationPipe(CreateWorkspaceBodySchema))
    body: TCreateWorkspaceBody,
  ) {
    return await this.workspacesService.createWorkspace(user.id, body);
  }
}
