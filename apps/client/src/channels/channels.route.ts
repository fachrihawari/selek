import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export const channelsRoute = [
  route(
    "/workspaces/:workspaceId/:channelId",
    "./channels/channels.layout.tsx",
    [index("./channels/channels-detail.page.tsx")]
  ),
] satisfies RouteConfig;
