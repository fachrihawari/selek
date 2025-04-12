import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { Request } from 'express';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  private readonly logger = new Logger(WorkspaceGuard.name);

  constructor(private workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const workspaceId = this.getWorkspaceId(request);

    if (!workspaceId) {
      this.logger.warn('Workspace ID missing in request');
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    if (!user) {
      this.logger.warn('Unauthenticated access attempt');
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    try {
      const isMember = await this.workspacesService.isWorkspaceMember(
        user.id,
        workspaceId,
      );

      if (!isMember) {
        this.logger.log(
          `Access denied for user ${user.id} on workspace ${workspaceId}`,
        );
        throw new ForbiddenException('Access denied'); // Use generic error for security reasons
      }

      return true;
    } catch (error) {
      this.logger.error(`Workspace access check failed: ${error.message}`);
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }
  }

  private getWorkspaceId(request: Request): string | null {
    return request.params?.id || request.body?.id || request.query?.id;
  }
}
