import { Injectable } from '@nestjs/common';
import { ConversationsModel } from './conversations.model';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversationsModel: ConversationsModel) {}

  async getGrouppedConversations(workspaceId: string, userId: string) {
    return this.conversationsModel.getGrouppedConversations(
      workspaceId,
      userId,
    );
  }

  async getConversations(workspaceId: string, userId: string) {
    const grouppedConversations =
      await this.conversationsModel.getGrouppedConversations(
        workspaceId,
        userId,
      );

    return grouppedConversations.flatMap((gc) => gc.conversations);
  }

  async getConversation(conversationId: string) {
    return this.conversationsModel.getConversation(conversationId);
  }

  async getMessages(conversationId: string, page: number, limit: number) {
    return this.conversationsModel.getMessages(conversationId, page, limit);
  }

  async isConversationMember(userId: string, conversationId: string) {
    const result = await this.conversationsModel.isMember(
      userId,
      conversationId,
    );
    return result;
  }

  async createMessage(body: {
    content: string;
    senderId: string;
    conversationId: string;
  }) {
    return this.conversationsModel.createMessage(body);
  }
}
