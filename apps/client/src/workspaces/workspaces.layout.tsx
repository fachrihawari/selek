import { Navigate, Outlet } from 'react-router';

import { ACCESS_TOKEN_KEY } from '~/shared';

export default function WorkspacesLayout() {
  if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
