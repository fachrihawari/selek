import { type RouteConfig, route, index } from "@react-router/dev/routes";

export const workspacesRoute = [
  route("workspaces", "./workspaces/layouts/workspaces.layout.tsx", [
    index("./workspaces/pages/workspaces-list.page.tsx"),
    route("create", "./workspaces/pages/workspaces-create.page.tsx"),
    route(":workspaceId", "./workspaces/pages/workspaces-detail.page.tsx"),
  ]),
] satisfies RouteConfig;
