import type React from 'react';
import {
  HiBars3,
  HiUsers,
} from 'react-icons/hi2';
import { useAppContext } from '~/shared';

interface ConversationHeaderProps {
  title: string;
  isLoading: boolean;
  onToggleMembers?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  title,
  isLoading,
  onToggleMembers,
}) => {
  const { toggleSidebar } = useAppContext();

  return (
    <div className="min-h-14 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <HiBars3 className="text-xl text-gray-600" />
        </button>

        {isLoading ? (
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h2 className="font-medium text-gray-900 truncate">{title}</h2>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {onToggleMembers && (
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 relative"
            onClick={onToggleMembers}
            title={`Members`}
          >
            <HiUsers className="text-xl text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};
