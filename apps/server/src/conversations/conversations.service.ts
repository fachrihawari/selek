import { Injectable } from '@nestjs/common';
import { ConversationsModel } from './conversations.model';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversationsModel: ConversationsModel) {}

  async getConversations(workspaceId: string) {
    return this.conversationsModel.getConversations(workspaceId);
  }
}
