import { Injectable } from '@nestjs/common';
import { ConversationsModel } from './conversations.model';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversationsModel: ConversationsModel) { }

  async getConversations(workspaceId: string, userId: string) {
    return this.conversationsModel.getConversations(workspaceId, userId);
  }

  async getConversation(conversationId: string) {
    return this.conversationsModel.getConversation(conversationId);
  }

  async getMessages(
    conversationId: string,
    page: number,
    limit: number,
  ) {
    return this.conversationsModel.getMessages(conversationId, page, limit);
  }

  async isConversationMember(userId: string, conversationId: string) {
    const result = await this.conversationsModel.isMember(
      userId,
      conversationId,
    );
    return result;
  }
}
