import { type RouteConfig, index, route } from '@react-router/dev/routes';

export const conversationsRoute = [
  route(
    '/:workspaceId/:conversationId',
    './conversations/conversations.layout.tsx',
    [index('./conversations/conversations.page.tsx')],
  ),
] satisfies RouteConfig;
