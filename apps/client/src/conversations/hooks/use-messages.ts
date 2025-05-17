import { useEffect, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { socket } from '~/shared';
import type { IMessage, IMessagesResponse } from '../conversations.interface';
import useSound from 'use-sound';
import type { IUser } from '~/users';
import useSWR from 'swr';

// Merge messages from all pages into a single array
const mergeMessages = (messagesInfinite?: IMessagesResponse[]) => {
  if (!messagesInfinite || messagesInfinite.length === 0) return [];

  const result = [];

  // Process pages in reverse order without mutating the original array
  for (let i = messagesInfinite.length - 1; i >= 0; i--) {
    const page = messagesInfinite[i];

    // Check if the page has messages and add them to the result
    if (page.messages && page.messages.length > 0) {
      result.push(...page.messages);
    }
  }

  return result;
};

export function useMessages(conversationId: string) {
  const getMessagesKey = (
    pageIndex: number,
    previousPageData: IMessagesResponse | null,
  ) => {
    if (pageIndex === 0) {
      return `/conversations/${conversationId}/messages?page=1`;
    }
    // If previous page has less than 20 items, we've reached the end
    if (previousPageData && previousPageData.messages.length < 20) return null;
    if (!previousPageData || !previousPageData.hasMore) return null;

    return `/conversations/${conversationId}/messages?page=${pageIndex + 1}`;
  };

  const {
    data: messagesInfinite,
    error: messagesError,
    isLoading: messagesLoading,
    isValidating: messagesValidating,
    setSize,
    size,
    mutate,
  } = useSWRInfinite<IMessagesResponse>(getMessagesKey, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data: user } = useSWR<IUser>('/auth/me');

  const [play] = useSound('/sounds/notif.wav')

  const messages = useMemo(
    () => mergeMessages(messagesInfinite),
    [messagesInfinite],
  );

  useEffect(() => {
    socket.emit('conversations:join', conversationId);
    return () => {
      socket.emit('conversations:leave', conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    socket.on('messages:new', (message: IMessage) => {
      // Only mutate if we have data
      if (messagesInfinite && messagesInfinite.length > 0) {
        // Create a shallow copy of the array
        const newData = [...messagesInfinite];
        
        // Make a shallow copy of just the first page
        newData[0] = { 
          ...newData[0], 
          messages: [...(newData[0].messages || [])] 
        };
        
        // Push the new message to the copied first page
        newData[0].messages.push(message);
        mutate(newData, false);
      }
      
      if (user?.id !== message.sender.id) play();
    });
    return () => {
      socket.off('messages:new');
    };
  }, [mutate, messagesInfinite, play, user]);

  return {
    messages,
    messagesError,
    messagesLoading,
    messagesValidating,
    size,
    setSize,
    hasMore: messagesInfinite?.[messagesInfinite.length - 1].hasMore,
  };
}
