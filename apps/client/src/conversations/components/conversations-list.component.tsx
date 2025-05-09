import React, { useState } from "react";
import { HiPlus } from "react-icons/hi2";

import { ConversationItem } from "./conversation-item.component";
import { conversationTypes } from "../conversations.constant";
import type { TConversationsList } from "../conversations.interface";
import useSWR from "swr";

interface ConversationsListProps {
  workspaceId: string;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  workspaceId,
}) => {
  const [activeConversationId] = useState("");
  const { data: conversations } = useSWR<TConversationsList>(
    "/conversations?workspaceId=" + workspaceId,
  );

  const handleConversationClick = (conversationId: string) => {};
  const handleAddClick = (type: string) => {};

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-orange-300 text-sm">
        No conversations available
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversationGroup, index) => (
        <div key={`conversation-group-${index}`} className="px-3 pt-4">
          <div className="flex items-center justify-between px-3 py-2 text-orange-300 text-sm">
            <span>{conversationTypes[conversationGroup.type]}</span>
            <button
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-orange-800/30"
              onClick={() => handleAddClick?.(conversationGroup.type)}
            >
              <HiPlus className="text-base" />
            </button>
          </div>
          <nav className="space-y-0.5">
            {conversationGroup.conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                name={conversation.name}
                type={conversationGroup.type}
                isActive={conversation.id === activeConversationId}
                onClick={() => handleConversationClick?.(conversation.id)}
              />
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
};
