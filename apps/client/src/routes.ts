import { type RouteConfig, index } from "@react-router/dev/routes";

import { authRoute } from "./auth";
import { workspacesRoute } from "./workspaces";

export default [
  index("./home.page.tsx"),
  ...authRoute,
  ...workspacesRoute,
] satisfies RouteConfig;
