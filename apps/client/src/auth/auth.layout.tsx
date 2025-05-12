import { Navigate, Outlet } from 'react-router';

import { getToken } from '~/shared';

export default function AuthLayout() {
  if (getToken()) {
    return <Navigate to="/workspaces" />;
  }

  return <Outlet />;
}
