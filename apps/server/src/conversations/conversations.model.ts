import { sql } from '~/db/sql';
import { TConversationsQueryResult, TMessagesQueryResult } from './conversations.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsModel {
  async getGrouppedConversations(workspaceId: string, userId: string) {
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

    // Fetch messages with pagination
    // Use a subquery to first get the messages in descending order
    // and then order them in ascending order for the final result
    // This is to ensure that the latest messages are at the top
    // and the pagination works correctly
    // Note: The limit + 1 is used to check if there is a next page
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
        LIMIT ${limit + 1} OFFSET ${offset}
      ) sub
      ORDER BY sub."createdAt" ASC
    `;
    // Determine if there is a next page
    const hasMore = messages.length > limit;
    
    // Only return up to the requested limit
    const paginatedMessages = hasMore ? messages.slice(0, limit) : messages;
    return {
      messages: paginatedMessages,
      hasMore,
    };
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