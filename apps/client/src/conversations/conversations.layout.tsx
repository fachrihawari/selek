import { HiSwitchHorizontal } from 'react-icons/hi';
import { HiBuildingOffice2, HiUser } from 'react-icons/hi2';
import { Link, Navigate, Outlet } from 'react-router';
import useSWR from 'swr';

import type { IHttpResponse } from '~/shared';
import { getToken, useAppContext, useLogout } from '~/shared';
import type { IUser } from '~/users';
import type { IWorkspace } from '~/workspaces';
import type { Route } from './+types/conversations.layout';
import { ConversationsList } from './components/conversations-list.component';
import { useSocketJoin } from './hooks/use-socket-join';

export default function ConversationsLayout({ params }: Route.ComponentProps) {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  const { workspaceId } = params;

  // Connect the user to the socket server and join the workspace conversations
  useSocketJoin(workspaceId);

  const logout = useLogout();
  const { data: workspace } = useSWR<IWorkspace, IHttpResponse>(
    `/workspaces/${workspaceId}`,
  );
  const { data: user } = useSWR<IUser>('/auth/me');

  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <div className="h-screen flex relative">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 sm:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleSidebar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleSidebar();
          }
        }}
        role="button"
        tabIndex={0}
      />
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-orange-950 to-orange-900
        text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'sm:relative translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Workspace Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-orange-800/50">
          {workspace ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-orange-700/50 flex items-center justify-center">
                  <HiBuildingOffice2 className="text-lg" />
                </div>
                <h1 className="font-semibold text-base truncate">
                  {workspace.name}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                {/* Switch Workspace Button */}
                <Link
                  to="/workspaces"
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-orange-800/30"
                >
                  <HiSwitchHorizontal className="text-xl" />
                </Link>
              </div>
            </>
          ) : (
            <div className="w-24 h-5 bg-orange-900/40 rounded animate-pulse" />
          )}
        </div>

        {/* Navigation Sections */}
        <ConversationsList workspaceId={workspaceId} />

        {/* User Profile */}
        <div className="p-3 border-t border-orange-800/50">
          {user && (
            <div className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
                <HiUser className="text-sm" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user?.fullName}
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          )}
          <button
            type="button"
            className="mt-2 w-full px-3 py-1.5 text-sm rounded-md bg-orange-800 hover:bg-orange-900 transition-colors"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
