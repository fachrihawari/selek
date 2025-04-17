import { type RouteConfig, route, index } from "@react-router/dev/routes";

export const workspacesRoute = [
  route("workspaces", "./workspaces/workspaces.layout.tsx", [
    index("./workspaces/workspaces-list.page.tsx"),
    route("create", "./workspaces/workspaces-create.page.tsx"),
    route(":workspaceId", "./workspaces/workspaces-detail.page.tsx"),
  ]),
] satisfies RouteConfig;
