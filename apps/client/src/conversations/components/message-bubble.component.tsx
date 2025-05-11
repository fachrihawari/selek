import type { IMessage } from '~/conversations/conversations.interface';

type MessageBubbleProps = {
  message: IMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const { sender } = message;

  return (
    <div className="flex justify-center items-start group hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${sender.fullName}`}
          alt={sender.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Content */}
      <div className="flex justify-center flex-col flex-1 min-w-0">
        {/* Sender Name and Timestamp */}
        <div className="flex items-baseline space-x-2">
          <span className="text-sm font-semibold text-gray-900 leading-none">
            {sender.fullName}
          </span>
          <span className="text-xs text-gray-400 leading-none mt-0.5">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {/* Message Text */}
        <div className="mt-0.5">
          <span className="inline-block text-sm text-gray-900 break-words whitespace-pre-line">
            {message.content}
          </span>
        </div>
      </div>
    </div>
  );
}
