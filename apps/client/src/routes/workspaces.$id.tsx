import type { Route } from "./+types/workspaces.$id";
import {
  HiHashtag,
  HiMagnifyingGlass,
  HiInformationCircle,
  HiPlus,
  HiPaperAirplane,
  HiFaceSmile,
  HiPencil,
  HiUser,
  HiBuildingOffice2,
} from "react-icons/hi2";

export async function clientLoader() {
  return {
    workspace: {
      name: "My Workspace",
      id: 1,
    },
  };
}

export default function WorkspaceDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { workspace } = loaderData;

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-orange-950 to-orange-900 text-white flex flex-col">
        {/* Workspace Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-orange-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-orange-700/50 flex items-center justify-center">
              <HiBuildingOffice2 className="text-lg" />
            </div>
            <h1 className="font-semibold text-base truncate">
              {workspace.name}
            </h1>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-orange-800/30">
            <HiPencil className="text-xl" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="px-3 py-4">
            <div className="flex items-center justify-between px-3 py-2 text-orange-300 text-sm">
              <span>Channels</span>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-orange-800/30">
                <HiPlus className="text-base" />
              </button>
            </div>
            <nav className="space-y-0.5">
              <a className="flex items-center px-3 py-1.5 rounded-md bg-orange-800/30 text-orange-100">
                <HiHashtag className="mr-3 text-lg" />
                <span className="font-medium">general</span>
              </a>
              <a className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 text-orange-200 hover:text-orange-100">
                <HiHashtag className="mr-3 text-lg" />
                <span className="font-medium">announcements</span>
              </a>
            </nav>
          </div>

          {/* Direct Messages */}
          <div className="px-3 pb-4">
            <div className="flex items-center justify-between px-3 py-2 text-orange-300 text-sm">
              <span>Direct messages</span>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-orange-800/30">
                <HiPlus className="text-base" />
              </button>
            </div>
            <nav className="space-y-0.5">
              <a className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 text-orange-200 hover:text-orange-100">
                <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center mr-3">
                  <HiUser className="text-sm" />
                </div>
                <span className="font-medium">John Doe</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-green-500"></span>
              </a>
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-orange-800/50">
          <div className="flex items-center px-3 py-1.5 rounded-md hover:bg-orange-800/30 cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
              <HiUser className="text-sm" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Your Name</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Channel Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <HiHashtag className="text-xl text-gray-600" />
            <h2 className="font-medium text-gray-900">general</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">
              <HiMagnifyingGlass className="text-xl text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">
              <HiInformationCircle className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="text-center text-gray-500 py-8">
              <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto mb-3 flex items-center justify-center">
                <HiHashtag className="text-3xl text-orange-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Welcome to #general
              </h3>
              <p>This is the start of the #general channel</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg">
            <input
              type="text"
              placeholder="Message #general"
              className="flex-1 focus:outline-none"
            />
            <div className="flex items-center space-x-2 ml-4">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <HiPlus className="text-xl text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <HiFaceSmile className="text-xl text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <HiPaperAirplane className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
