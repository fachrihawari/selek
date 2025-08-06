import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useOnlineUsers } from '../hooks/use-online-users';
import type { IConversation } from '../conversations.interface';

interface ConversationMembersProps {
  conversation?: IConversation;
  isLoading: boolean;
  workspaceId: string;
}

export function ConversationMembers({ workspaceId, conversation, isLoading }: ConversationMembersProps) {
  const onlineUsers = useOnlineUsers(useShallow((state) => {
    return state.byWorkspaceId[workspaceId] || []
  }));

  const members = useMemo(() => {
    if (!conversation) return [];
    return conversation.members.map(user => ({
      id: user.id,
      fullName: user.fullName,
      isOnline: onlineUsers.some(onlineUser => onlineUser.id === user.id),
    }));
  }, [conversation?.members, onlineUsers]);

  if (isLoading) {
    return (
      <div className={`hidden md:flex flex-col bg-white border-gray-200 border-l w-64 h-full`}>
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

  return (
    <div
      className={`hidden md:flex flex-col bg-white border-gray-200 border-l w-64 h-full`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-tl-lg">
        <h3 className="text-sm font-medium text-gray-900">
          Members ({members.length})
        </h3>
      </div>

      {/* Scrollable Members List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 px-2 py-1 rounded-md"
            >
              <div className={`h-2 w-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`} />
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
