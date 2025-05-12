import { useRef } from 'react';
import useSWR from 'swr';
import { useIntersectionObserver } from 'usehooks-ts';
import { AlertError, Loading } from '~/components';
import { useScrollToBottom } from '~/shared';
import type { Route } from './+types/conversations-detail.page';
import { ConversationHeader } from './components/conversation-header.component';
import { ConversationTypeIcon } from './components/conversation-type-icon.component';
import { MessageBubble } from './components/message-bubble.component';
import { MessageInput } from './components/message-input.component';
import type { IConversation, IMessage } from './conversations.interface';

export default function ConversationsDetailPage({
  params,
}: Route.ComponentProps) {
  const { conversationId } = params;

  // Reference to the messages container
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: conversation,
    error: conversationError,
    isLoading: conversationLoading,
    isValidating: conversationValidating,
  } = useSWR<IConversation>(`/conversations/${conversationId}`);
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
    isValidating: messagesValidating,
  } = useSWR<IMessage[]>(`/conversations/${conversationId}/messages`);

  // Infinite scroll
  const { ref: inViewRef } = useIntersectionObserver({
    threshold: 0.1,
  });

  // Automatically scroll to the bottom of the messages when new messages are loaded
  useScrollToBottom(ref, [messages]);

  // Set the ref to the messages container and trigger the inViewRef callback
  const setRefs = (node: HTMLDivElement) => {
    ref.current = node;
    inViewRef(node);
  };

  const hasMessages = messages && messages.length > 0;
  const hasError = conversationError || messagesError;
  const hasNoMessages =
    !hasMessages &&
    !messagesValidating &&
    !conversationValidating &&
    conversation;

  let content: React.ReactNode;

  if (messagesLoading) {
    content = <Loading />;
  }
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
        ref={setRefs}
        className="mt-auto flex flex-col overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {content}
      </div>

      <MessageInput conversationId={conversationId} />
    </>
  );
}
