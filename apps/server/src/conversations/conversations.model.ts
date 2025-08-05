import { sql } from '~/db/sql';
import {
  TConversationsQueryResult,
  TCreateConversationWithOwner,
  TMessagesQueryResult,
} from './conversations.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsModel {
  async getGrouppedConversations(workspaceId: string, userId: string) {
    const conversations = await sql<TConversationsQueryResult[]>`
      SELECT 
        c.type,
        JSON_AGG(JSON_BUILD_OBJECT('id', c.id, 'name', c.name) ORDER BY c."createdAt" ASC) AS conversations
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
    // HINT: This is a simple pagination implementation, if in the future there is a problem with performance, we can implement cursor-based pagination

    // Get total count of messages
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(id)::int as count FROM conversation_messages WHERE "conversationId" = ${conversationId}
    `;
    // Calculate offset from the end (so page 1 is the latest messages)
    const total = count || 0;

    // Calculate the correct offset for this page
    const offset = Math.max(total - page * limit, 0);

    // For hasMore, check if there are more messages beyond the current page
    const hasMore = total > page * limit;

    // Calculate how many messages should be fetched for this page
    // If it's the last page, we only want the remaining messages (which might be less than limit)
    // Otherwise, we fetch the full limit
    let fetchLimit = limit;
    if (!hasMore) {
      // On the last page, calculate remaining messages
      const remaining = total - (page - 1) * limit;
      fetchLimit = remaining > 0 ? remaining : limit; // Safety check to never have a negative or zero limit
    }

    // Fetch messages with the calculated limit
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
      OFFSET ${offset} LIMIT ${fetchLimit} 
    `;

    return {
      messages,
      hasMore,
    };
  }

  private async isConversationExists(
    type: string,
    workspaceId: string,
    members: string[],
  ) {
    // Get all conversation ids for the user
    const candidateConversations = await sql`
      SELECT c.id, c.name, c.type, c."createdAt"
      FROM conversation_members cm
      JOIN conversations c ON cm."conversationId" = c.id
      WHERE c.type = ${type} AND c."workspaceId" = ${workspaceId}
      AND cm."userId" in ${sql(members)}
    `;

    // For each candidate, check if the set of members matches exactly
    for (const conversation of candidateConversations) {
      const memberRows = await sql<{ userId: string }[]>`
          SELECT "userId" FROM conversation_members WHERE "conversationId" = ${conversation.id}
        `;
      const memberIds = memberRows.map((m) => m.userId).sort();
      const inputIds = [...members].sort();
      if (
        memberIds.length === inputIds.length &&
        memberIds.every((id, i) => id === inputIds[i])
      ) {
        return conversation;
      }
    }
  }

  async createConversation({ members, ...body }: TCreateConversationWithOwner) {
    // Check if a group or dm with the same members already exists
    if (body.type === 'group' || body.type === 'dm') {
      const conversation = await this.isConversationExists(
        body.type,
        body.workspaceId,
        members,
      );
      if (conversation) {
        return conversation;
      }
    }
    await sql.begin(async (sql) => {
      // Create the conversation
      const [conversation] = await sql`
        INSERT INTO conversations ${sql(body)}
        RETURNING id, name, type, "createdAt"
      `;

      const conversationMembers = members.map((memberId) => ({
        userId: memberId,
        conversationId: conversation.id,
        role: memberId === body.ownerId ? 'owner' : 'member',
      }));

      // Add the owner as a member
      await sql`
        INSERT INTO conversation_members ${sql(conversationMembers)}
      `;

      return conversation;
    });
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
