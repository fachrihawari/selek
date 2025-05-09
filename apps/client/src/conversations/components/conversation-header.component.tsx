import type React from 'react';
import {
  HiBars3,
  HiHashtag,
  HiInformationCircle,
  HiMagnifyingGlass,
} from 'react-icons/hi2';
import { useAppContext } from '~/shared';

interface ConversationHeaderProps {
  title: string;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  title,
}) => {
  const { toggleSidebar } = useAppContext();

  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <HiBars3 className="text-xl text-gray-600" />
        </button>
        <HiHashtag className="text-xl text-gray-600" />
        <h2 className="font-medium text-gray-900 truncate">{title}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <HiMagnifyingGlass className="text-xl text-gray-600" />
        </button>
        <button
          type="button"
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <HiInformationCircle className="text-xl text-gray-600" />
        </button>
      </div>
    </div>
  );
};
