import { type RouteConfig, index } from "@react-router/dev/routes";

import { authRoute } from "./auth";
import { workspacesRoute } from "./workspaces";
import { channelsRoute } from "./channels";

export default [
  index("./home.page.tsx"),
  ...authRoute,
  ...workspacesRoute,
  ...channelsRoute
] satisfies RouteConfig;
