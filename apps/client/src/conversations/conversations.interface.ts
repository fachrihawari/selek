import type { IUser } from '~/users';

export interface IConversation {
  id: string;
  name: string;
  type: 'dm' | 'group' | 'channel';
  createdAt: string;
  members: Pick<IUser, 'id' | 'fullName'>[];
}

export interface IConversationGroup {
  type: 'dm' | 'group' | 'channel';
  conversations: IConversation[];
}

export type TConversationsList = IConversationGroup[];

export interface IMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: Pick<IUser, 'id' | 'fullName'>;
}

export interface IMessagesResponse {
  messages: IMessage[];
  hasMore: boolean;
}
