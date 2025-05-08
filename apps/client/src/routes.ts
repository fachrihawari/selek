import { type RouteConfig, index } from "@react-router/dev/routes";

import { authRoute } from "./auth";
import { workspacesRoute } from "./workspaces";
import { conversationsRoute } from "./conversations";

export default [
  index("./home.page.tsx"),
  ...authRoute,
  ...workspacesRoute,
  ...conversationsRoute
] satisfies RouteConfig;
