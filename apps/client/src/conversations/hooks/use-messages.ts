import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { IMessagesResponse } from '../conversations.interface';

const mergeMessages = (messagesInfinite?: IMessagesResponse[]) => {
  if (!messagesInfinite) return [];

  const result = [];
  for (const el of messagesInfinite.reverse()) {
    result.push(...el.messages);
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
  } = useSWRInfinite<IMessagesResponse>(getMessagesKey, {
    revalidateFirstPage: false,
  });

  const messages = useMemo(
    () => mergeMessages(messagesInfinite),
    [messagesInfinite],
  );

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
