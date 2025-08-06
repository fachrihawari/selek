import { memo } from "react";
import { HiSwitchHorizontal, HiUser } from "react-icons/hi";
import { HiBuildingOffice2, HiCog6Tooth } from "react-icons/hi2";
import { Link } from "react-router";
import useSWR from "swr";
import { useLogout, type IHttpResponse } from "~/shared";
import { useAppContext } from "~/shared/app.context";
import type { IUser } from "~/users";
import type { IWorkspace } from "~/workspaces";
import { ConversationsList } from "./conversations-list.component";

interface ConversationSidebarProps {
  openModal: (type: 'dm' | 'group' | 'channel') => void;
  workspaceId: string;
}
export function ConversationSidebar({ openModal, workspaceId }: ConversationSidebarProps) {
  const logout = useLogout();
  const { sidebarOpen } = useAppContext();

  const { data: workspace } = useSWR<IWorkspace, IHttpResponse>(
    `/workspaces/${workspaceId}`,
  );
  const { data: user } = useSWR<IUser>('/auth/me');

  return (
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
              {workspace.logoUrl ? (
                <img
                  src={workspace.logoUrl}
                  alt={workspace.name}
                  className="w-6 h-6 rounded bg-orange-700/50 object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded bg-orange-700/50 flex items-center justify-center">
                  <HiBuildingOffice2 className="text-lg" />
                </div>
              )}
              <h1 className="font-semibold text-base truncate">
                {workspace.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Settings Button */}
              <Link
                to={`/${workspaceId}/settings`}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-orange-800/30"
                title="Workspace Settings"
              >
                <HiCog6Tooth className="text-xl" />
              </Link>
              {/* Switch Workspace Button */}
              <Link
                to="/workspaces"
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-orange-800/30"
                title="Switch Workspace"
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
      <ConversationsList
        workspaceId={workspaceId}
        onAddClick={openModal}
      />

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
  );
}
