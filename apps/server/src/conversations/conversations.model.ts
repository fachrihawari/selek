import { sql } from '~/db/sql';
import { TConversationsQueryResult } from './conversations.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsModel {
  async getConversations(workspaceId: string, userId: string) {
    const conversations = await sql<TConversationsQueryResult[]>`
      SELECT 
        c.type,
        JSON_AGG(JSON_BUILD_OBJECT('id', c.id, 'name', c.name)) AS conversations
      FROM conversations c
      JOIN conversation_members cm ON c.id = cm."conversationId"
      WHERE c."workspaceId" = ${workspaceId}
      AND cm."userId" = ${userId}
      GROUP BY c.type
    `;
    return conversations;
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;

    const messages = await sql`
      SELECT 
        m.id,
        m.content,
        m."createdAt",
        JSON_BUILD_OBJECT(
          'id', u.id,
          'fullName', u."fullName"
        ) AS "sender"
      FROM conversation_messages m
      JOIN users u ON m."senderId" = u.id
      WHERE m."conversationId" = ${conversationId}
      ORDER BY m."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return messages;
  }

  async isMember(userId: string, conversationId: string) {
    const [conversation] = await sql<{ joinedAt: string }[]>`
      SELECT "joinedAt"
      FROM conversation_members
      WHERE "userId" = ${userId} AND "conversationId" = ${conversationId}
    `;
    return Boolean(conversation);
  }
}