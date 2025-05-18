import type React from 'react';
import { HiPlus } from 'react-icons/hi2';

import { useParams } from 'react-router';
import useSWR from 'swr';
import { conversationTypes } from '../conversations.constant';
import type { TConversationsList } from '../conversations.interface';
import { ConversationItem } from './conversation-item.component';
import { ConversationsListLoader } from './conversations-list-loader.component';

interface ConversationsListProps {
  workspaceId: string;
  onAddClick: (type: 'dm' | 'group' | 'channel') => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  workspaceId,
  onAddClick,
}) => {
  const activeConversationId = useParams().conversationId;
  const { data: conversations, isLoading } = useSWR<TConversationsList>(
    `/conversations?workspaceId=${workspaceId}`,
  );

  if (isLoading) {
    return <ConversationsListLoader />;
  }

  // Map API response by type for quick lookup
  const groupMap = Object.fromEntries(
    (conversations || []).map((g) => [g.type, g])
  );

  // List of all possible types
  const allTypes = Object.keys(conversationTypes) as Array<'dm' | 'group' | 'channel'>;

  return (
    <div className="flex-1 overflow-y-auto">
      {allTypes.map((type) => {
        // Get the label and group for the current type
        const label = conversationTypes[type];

        // Use the groupMap to find the corresponding group or create a new one
        const group = groupMap[type] || { type, conversations: [] };

        return (
          <div
            key={`conversation-group-${type}`}
            className="px-3 pt-4"
          >
            <div className="flex items-center justify-between px-3 py-2 text-orange-300 text-sm">
              <span>{label}</span>
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-orange-800/30"
                onClick={() => onAddClick(type)}
              >
                <HiPlus className="text-base" />
              </button>
            </div>
            <nav className="space-y-0.5">
              {group.conversations.length === 0 ? (
                <div className="px-3 py-2 text-orange-500 text-xs opacity-60">No conversations</div>
              ) : (
                group.conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    name={conversation.name}
                    type={type}
                    isActive={conversation.id === activeConversationId}
                    to={`/${workspaceId}/${conversation.id}`}
                  />
                ))
              )}
            </nav>
          </div>
        );
      })}
    </div>
  );
};
