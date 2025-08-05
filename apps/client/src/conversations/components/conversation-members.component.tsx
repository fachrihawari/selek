import { HiUser, HiXMark } from 'react-icons/hi2';
import type { IConversation } from '../conversations.interface';

interface ConversationMembersProps {
  conversation: IConversation;
  isLoading?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
}

export function ConversationMembers({ conversation, isLoading, isVisible = false, onToggle }: ConversationMembersProps) {
  
  if (isLoading) {
    return (
      <div className={`absolute top-0 right-0 bg-white shadow-lg border border-gray-200 rounded-l-lg w-80 h-full z-20 ${isVisible ? 'block' : 'hidden'}`}>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { members } = conversation;

  return (
    <div
      className={`absolute top-0 right-0 bg-white shadow-lg border border-t-0 border-gray-200 rounded-l-lg w-80 h-full flex flex-col z-20 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-tl-lg">
        <h3 className="text-sm font-medium text-gray-900">
          Members ({members.length})
        </h3>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
            title="Hide members"
          >
            <HiXMark className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Scrollable Members List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <HiUser className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.fullName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
