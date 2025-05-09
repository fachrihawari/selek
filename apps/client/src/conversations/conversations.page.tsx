import {
  HiHashtag,
  HiMagnifyingGlass,
  HiInformationCircle,
  HiPlus,
  HiPaperAirplane,
  HiFaceSmile,
  HiBars3,
} from "react-icons/hi2";
import { useAppContext } from "~/shared/app.context";

export default function ConversationsDetailPage() {
  const { toggleSidebar } = useAppContext();

  return (
    <>
      {/* Conversation Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <HiBars3 className="text-xl text-gray-600" />
          </button>
          <HiHashtag className="text-xl text-gray-600" />
          <h2 className="font-medium text-gray-900 truncate">general</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 hidden sm:flex items-center justify-center rounded-md hover:bg-gray-100">
            <HiMagnifyingGlass className="text-xl text-gray-600" />
          </button>
          <button className="w-8 h-8 hidden sm:flex items-center justify-center rounded-md hover:bg-gray-100">
            <HiInformationCircle className="text-xl text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area - remains mostly the same */}
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
      <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 border border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder="Message #general"
            className="flex-1 focus:outline-none min-w-0"
          />
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
            <button className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100">
              <HiPlus className="text-xl text-gray-600" />
            </button>
            <button className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100">
              <HiFaceSmile className="text-xl text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
              <HiPaperAirplane className="text-xl text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
