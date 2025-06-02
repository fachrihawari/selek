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
export class WorkspaceOwnerGuard implements CanActivate {
  private readonly logger = new Logger(WorkspaceOwnerGuard.name);

  constructor(private workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const workspaceId = this.getWorkspaceId(request);

    if (!workspaceId) {
      this.logger.warn('Workspace ID missing in request');
      throw new ForbiddenException('Access denied');
    }

    if (!user) {
      this.logger.warn('Unauthenticated access attempt to workspace', {
        workspaceId,
      });
      throw new ForbiddenException('Access denied');
    }

    try {
      const isOwner = await this.workspacesService.isWorkspaceOwner(
        user.id,
        workspaceId,
      );

      if (!isOwner) {
        this.logger.warn(
          `Only workspace owner can perform this action: user ${user.id} on workspace ${workspaceId}`,
          { userId: user.id, workspaceId },
        );
        throw new ForbiddenException('Only workspace owner can perform this action');
      }

      return true;
    } catch (error) {
      this.logger.warn(`Workspace owner check failed: ${error.message}`, {
        userId: user.id,
        workspaceId,
      });
      throw new ForbiddenException('Access denied');
    }
  }

  private getWorkspaceId(request: Request): string | null {
    return (
      request.params?.workspaceId ||
      request.body?.workspaceId ||
      request.query?.workspaceId
    );
  }
}
