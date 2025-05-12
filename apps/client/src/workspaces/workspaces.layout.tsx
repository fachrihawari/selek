import { Navigate, Outlet } from 'react-router';

import { getToken } from '~/shared';

export default function WorkspacesLayout() {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
