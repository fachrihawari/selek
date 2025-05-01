import { sql } from '~/db/sql';
import { TConversation, TConversationsQueryResult } from './conversations.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsModel {
  async getConversations(workspaceId: string) {
    const conversations = await sql<TConversationsQueryResult[]>`
      SELECT 
          c.type,
          JSON_AGG(JSON_BUILD_OBJECT('id', c.id, 'name', c.name)) AS conversations
      FROM conversations c
      WHERE c."workspaceId" = ${workspaceId}
      GROUP BY c.type
    `;
    return conversations;
  }
}