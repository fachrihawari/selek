import { Reflector } from '@nestjs/core';
import { WorkspaceRole } from './workspaces.schema';

export const WorkspaceRoles = Reflector.createDecorator<WorkspaceRole[]>();
