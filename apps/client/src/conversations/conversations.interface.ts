export interface IConversation {
  id: string;
  name: string;
}

export interface IConversationGroup {
  type: 'dm' | 'group' | 'channel';
  conversations: IConversation[];
}

export type TConversationsList = IConversationGroup[];