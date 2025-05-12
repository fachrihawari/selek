import { sql } from '~/db/sql';
import { TConversationsQueryResult, TMessagesQueryResult } from './conversations.schema';
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

  async getConversation(conversationId: string) {
    const [conversation] = await sql`
      SELECT
        c.id,
        c.name,
        c.type,
        c."createdAt",
        JSON_AGG(JSON_BUILD_OBJECT('id', u.id, 'fullName', u."fullName")) AS "members"
      FROM conversations c
      JOIN conversation_members cm ON c.id = cm."conversationId"
      JOIN users u ON cm."userId" = u.id
      WHERE c.id = ${conversationId}
      GROUP BY c.id
    `;
    return conversation;
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;

    const messages = await sql<TMessagesQueryResult[]>`
      SELECT * FROM (
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
      ) sub
      ORDER BY sub."createdAt" ASC
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

  async createMessage(body: { content: string, senderId: string, conversationId: string }) {
    const [message] = await sql<TMessagesQueryResult[]>`
      WITH inserted AS (
        INSERT INTO conversation_messages ${sql(body)}
        RETURNING id, content, "createdAt", "senderId"
      )
      SELECT 
        inserted.id,
        inserted.content,
        inserted."createdAt",
        JSON_BUILD_OBJECT(
          'id', u.id,
          'fullName', u."fullName"
        ) AS sender
      FROM inserted
      JOIN users u ON inserted."senderId" = u.id
    `;
    return message;
  }
}