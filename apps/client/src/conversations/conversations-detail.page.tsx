import { HiHashtag } from 'react-icons/hi2';
import useSWR from 'swr';
import { AlertError, Loading } from '~/components';
import type { Route } from './+types/conversations-detail.page';
import { ConversationHeader } from './components/conversation-header.component';
import { MessageBubble } from './components/message-bubble.component';
import { MessageInput } from './components/message-input.component';
import type { IConversation, IMessage } from './conversations.interface';
import { ConversationTypeIcon } from './components/conversation-type-icon.component';

export default function ConversationsDetailPage({
  params,
}: Route.ComponentProps) {
  const { conversationId } = params;

  const {
    data: conversation,
    error: conversationError,
    isLoading: conversationLoading,
  } = useSWR<IConversation>(`/conversations/${conversationId}`);
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
  } = useSWR<IMessage[]>(`/conversations/${conversationId}/messages`);

  let content: React.ReactNode

  if (messagesLoading) {
    content = <Loading />;
  }
  if (conversationError || messagesError) {
    content = <AlertError message="Failed to load messages" />;
  }

  if (messages && messages.length) {
    content = messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ));
  }

  if (conversation) {
    content = (
      <div className="text-center text-gray-500">
        <ConversationTypeIcon size='lg' center type={conversation.type} />
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
      <div className="flex flex-1 flex-col justify-end overflow-y-auto p-4 space-y-4">
        {content}
      </div>

      <MessageInput />
    </>
  );
}
