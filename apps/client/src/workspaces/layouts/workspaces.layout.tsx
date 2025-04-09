import { Navigate, Outlet } from "react-router";

import { ACCESS_TOKEN_KEY } from "~/shared";

export default function WorkspacesLayout() {
  if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
    console.log("navigate");

    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
