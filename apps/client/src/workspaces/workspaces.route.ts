import { type RouteConfig, index, route } from '@react-router/dev/routes';

export const workspacesRoute = [
  route('workspaces', './workspaces/workspaces.layout.tsx', [
    index('./workspaces/workspaces-list.page.tsx'),
    route('create', './workspaces/workspaces-create.page.tsx'),
  ]),
] satisfies RouteConfig;
