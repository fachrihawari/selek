import { sql } from '~/db/sql';
import {
  TConversationsQueryResult,
  TMessagesQueryResult,
} from './conversations.schema';
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
    // Get total count of messages
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(id)::int as count FROM conversation_messages WHERE "conversationId" = ${conversationId}
    `;
    // Calculate offset from the end (so page 1 is the latest messages)
    const total = count || 0;
    const offset = Math.max(total - page * limit, 0);
    const realLimit = Math.min(limit + 1, total - offset); // fetch limit+1 to check hasMore, but not more than available

    // Fetch messages in ascending order (oldest to newest)
    const messages = await sql<TMessagesQueryResult[]>`
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
      ORDER BY m."createdAt" ASC
      LIMIT ${realLimit} OFFSET ${offset}
    `;
    // Determine if there is a next page (older messages)
    const hasMore = messages.length > limit;

    // Only return up to the requested limit
    const paginatedMessages = hasMore ? messages.slice(1) : messages;
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

  async createMessage(body: {
    content: string;
    senderId: string;
    conversationId: string;
  }) {
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
