import { TMessagesQueryResult } from './conversations.schema';

export class MessageCreatedEvent {
  constructor(
    public readonly conversationId: string,
    public readonly message: TMessagesQueryResult,
  ) {}
}
