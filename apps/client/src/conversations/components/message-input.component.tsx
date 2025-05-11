import { HiPaperAirplane, HiPlus } from 'react-icons/hi';
import { HiFaceSmile } from 'react-icons/hi2';

export function MessageInput() {
  return (
    <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 border border-gray-300 rounded-lg">
        <input
          type="text"
          placeholder="Message #general"
          className="flex-1 focus:outline-none min-w-0"
        />
        <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
          <button
            type="button"
            className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100"
          >
            <HiPlus className="text-xl text-gray-600" />
          </button>
          <button
            type="button"
            className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100"
          >
            <HiFaceSmile className="text-xl text-gray-600" />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 rotate-90"
          >
            <HiPaperAirplane className="text-xl text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
