import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export const authRoute = [
  layout("./auth/auth.layout.tsx", [
    route("login", "./auth/auth-login.page.tsx"),
    route("register", "./auth/auth-register.page.tsx"),
  ]),
] satisfies RouteConfig;
