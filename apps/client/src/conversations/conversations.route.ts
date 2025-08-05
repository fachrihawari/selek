import { type RouteConfig, index, route } from '@react-router/dev/routes';

export const conversationsRoute = [
  route('/:workspaceId', './conversations/conversations.layout.tsx', [
    index('./conversations/conversations-welcome.page.tsx'),
    route('settings', './workspaces/workspace-settings.page.tsx'),
    route(':conversationId', './conversations/conversations-detail.page.tsx'),
  ]),
] satisfies RouteConfig;
