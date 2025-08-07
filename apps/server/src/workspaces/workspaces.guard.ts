import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { WorkspaceRoles } from './workspaces.decorator';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  private readonly logger = new Logger(WorkspaceGuard.name);

  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const workspaceId = this.getWorkspaceId(request);
    const roles = this.reflector.get(WorkspaceRoles, context.getHandler());

    if (!workspaceId) {
      this.logger.warn('Workspace ID missing in request');
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    if (!user) {
      this.logger.warn('Unauthenticated access attempt to workspace', {
        workspaceId,
      });
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
    }

    this.logger.debug(
      `Checking workspace access for user ${user?.id} on workspace ${workspaceId}`,
      {
        method: request.method,
        url: request.url,
        userId: user?.id,
        workspaceId,
        roles,
        handler: context.getHandler().name,
      },
    );

    try {
      const member = await this.workspacesService.findWorkspaceMember(
        user.id,
        workspaceId,
      );

      if (!member) {
        this.logger.warn(
          `Access denied for user ${user.id} on workspace ${workspaceId}`,
          { userId: user.id, workspaceId },
        );
        throw new ForbiddenException('Access denied'); // Use generic error for security reasons
      }

      if (roles && !roles.includes(member.role)) {
        this.logger.warn(
          `User ${user.id} does not have required roles for workspace ${workspaceId}`,
          { userId: user.id, workspaceId, roles },
        );
        throw new ForbiddenException('Access denied'); // Use generic error for security reasons
      }

      return true;
    } catch (error) {
      this.logger.warn(`Workspace access check failed: ${error.message}`, {
        userId: user.id,
        workspaceId,
      });
      throw new ForbiddenException('Access denied'); // Use generic error for security reasons
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
