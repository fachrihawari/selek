import { Reflector } from '@nestjs/core';
import type { WorkspaceRole } from './workspaces.schema';

export const WorkspaceRoles = Reflector.createDecorator<WorkspaceRole[]>();
