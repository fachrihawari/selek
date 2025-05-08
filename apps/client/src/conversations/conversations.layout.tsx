import { useState } from "react";
import {
  HiHashtag,
  HiPlus,
  HiUser,
  HiBuildingOffice2,
  HiXMark,
} from "react-icons/hi2";
import { Outlet, useParams } from "react-router";
import useSWR from "swr";

import type { IHttpResponse } from "~/shared";
import type { IWorkspace } from "~/workspaces";
import type { TConversationsList } from "./conversations.interface";
import { conversationTypes } from "./conversations.constant";
import type { IUser } from "~/users";

export default function ConversationsLayout() {
  const { workspaceId } = useParams();
  const { data: workspace } = useSWR<IWorkspace, IHttpResponse>(
    "/workspaces/" + workspaceId
  );
  const { data: conversations } = useSWR<TConversationsList>(
    "/conversations?workspaceId=" + workspaceId
  );
  const { data: user } = useSWR<IUser>("/auth/me");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-orange-950 to-orange-900 
        text-white flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Workspace Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-orange-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-orange-700/50 flex items-center justify-center">
              <HiBuildingOffice2 className="text-lg" />
            </div>
            <h1 className="font-semibold text-base truncate">
              {workspace?.name}
            </h1>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-orange-800/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto">
          {conversations?.map?.((conversation) => {
            return (
              <div className="px-3 pt-4">
                <div className="flex items-center justify-between px-3 py-2 text-orange-300 text-sm">
                  <span>{conversationTypes[conversation.type]}</span>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-orange-800/30">
                    <HiPlus className="text-base" />
                  </button>
                </div>
                <nav className="space-y-0.5">
                  {conversation.conversations.map((c) => (
                    <a className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 text-orange-100">
                      {conversation.type === "dm" ? (
                        <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
                          <HiUser className="text-sm" />
                        </div>
                      ) : (
                        <HiHashtag className="text-lg" />
                      )}
                      <span className="font-medium ml-3">{c.name}</span>
                    </a>
                  ))}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-orange-800/50">
          <div className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
              <HiUser className="text-sm" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.fullName}
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
