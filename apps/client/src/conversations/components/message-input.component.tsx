import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiPaperAirplane, HiPlus } from 'react-icons/hi';
import { HiFaceSmile } from 'react-icons/hi2';
import { mutate } from 'swr';
import { http, type IHttpResponse } from '~/shared';
import type { IMessage } from '../conversations.interface';

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
}) => {
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      const data = await http<IMessage>(
        `/conversations/${conversationId}/messages`,
        {
          body: {
            content,
          },
        },
      );
      mutate(
        `/conversations/${conversationId}/messages`,
        (p?: IMessage[]) => [...(p ?? []), data],
        { revalidate: false },
      );
      setContent('');
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error((error as IHttpResponse).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 border border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 focus:outline-none min-w-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
            <button
              type="button"
              className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100"
            >
              <HiPlus className="text-xl text-gray-600" />
            </button>
            <button
              type="button"
              className="w-8 h-8 hidden sm:flex items-center justify-center rounded hover:bg-gray-100"
            >
              <HiFaceSmile className="text-xl text-gray-600" />
            </button>
            <button
              type="submit"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 rotate-90"
            >
              <HiPaperAirplane className="text-xl text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
