import { Navigate, Outlet } from "react-router";
import { ACCESS_TOKEN_KEY } from "~/constants";

export default function AuthLayout() {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return <Navigate to='/workspaces' />
  }

  return <Outlet />;
}