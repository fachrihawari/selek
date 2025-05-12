import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { AlertError, Loading } from '~/components';
import { useScrollToBottom } from '~/shared';
import {
  useInfiniteScrollTop,
  usePreserveScrollOnPrepend,
} from '~/shared/app.hook';
import type { Route } from './+types/conversations-detail.page';
import { ConversationHeader } from './components/conversation-header.component';
import { ConversationTypeIcon } from './components/conversation-type-icon.component';
import { MessageBubble } from './components/message-bubble.component';
import { MessageInput } from './components/message-input.component';
import type { IConversation } from './conversations.interface';
import { useMessages } from './hooks/use-messages';

export default function ConversationsDetailPage({
  params,
}: Route.ComponentProps) {
  const { conversationId } = params;

  const {
    data: conversation,
    error: conversationError,
    isLoading: conversationLoading,
    isValidating: conversationValidating,
  } = useSWR<IConversation>(`/conversations/${conversationId}`);

  const {
    setSize,
    hasMore,
    messagesLoading,
    messagesValidating,
    messagesError,
    messages,
  } = useMessages(conversationId);

  const ref = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom of the messages when new messages are loaded
  useScrollToBottom(ref, [messagesLoading]);

  // Preserve scroll position after loading more messages (infinite scroll up)
  const { onBeforeLoadMore } = usePreserveScrollOnPrepend(ref, [
    messages.length,
  ]);

  // Infinite scroll for messages
  const sentinelRef = useInfiniteScrollTop({
    disabled: !hasMore || messagesValidating,
    threshold: 0.1,
    onLoadMore: () => {
      if (hasMore && !messagesValidating) {
        onBeforeLoadMore();
        setSize((prevSize) => prevSize + 1);
      }
    },
  });

  const hasMessages = messages && messages.length > 0;
  const hasError = conversationError || messagesError;
  const hasNoMessages =
    !hasMessages &&
    !messagesValidating &&
    !conversationValidating &&
    conversation;

  let content: React.ReactNode;

  if (hasError) {
    content = <AlertError message="Failed to load messages" />;
  }
  if (hasMessages) {
    content = messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ));
  }
  if (hasNoMessages) {
    content = (
      <div className="text-center text-gray-500">
        <ConversationTypeIcon size="lg" center type={conversation.type} />
        <h3 className="text-lg font-medium text-gray-900 mb-1 mt-3">
          Welcome to {conversation.name}
        </h3>
        <p>
          This is the start of the {conversation.name} {conversation.type}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Conversation Header */}
      <ConversationHeader
        isLoading={conversationLoading}
        title={conversation?.name ?? ''}
      />

      {/* Messages Area */}
      <div
        ref={ref}
        className="mt-auto flex flex-col overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {messagesValidating ? (
          <Loading />
        ) : (
          <div ref={sentinelRef} className="w-full h-4" />
        )}
        {content}
      </div>

      <MessageInput conversationId={conversationId} />
    </>
  );
}
