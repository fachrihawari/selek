import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export const authRoute = [
  layout("./auth/layouts/auth.layout.tsx", [
    route("login", "./auth/pages/auth-login.page.tsx"),
    route("register", "./auth/pages/auth-register.page.tsx"),
  ]),
] satisfies RouteConfig;
