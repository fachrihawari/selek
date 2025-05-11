import { HiHashtag } from 'react-icons/hi2';
import useSWR from 'swr';
import { AlertError, Loading } from '~/components';
import type { Route } from './+types/conversations-detail.page';
import { ConversationHeader } from './components/conversation-header.component';
import { MessageBubble } from './components/message-bubble.component';
import { MessageInput } from './components/message-input.component';
import type { IConversation, IMessage } from './conversations.interface';

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

  let content: React.ReactNode = (
    <div className="text-center text-gray-500">
      <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto mb-3 flex items-center justify-center">
        <HiHashtag className="text-3xl text-orange-900" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Welcome to {conversation?.name}
      </h3>
      <p>
        This is the start of the {conversation?.name} {conversation?.type}
      </p>
    </div>
  );

  if (messagesLoading) {
    content = <Loading />;
  }
  if (conversationError || messagesError) {
    content = <AlertError message="Failed to load messages" />;
  }

  if (messages?.length) {
    content = messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ));
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
