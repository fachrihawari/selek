import { z } from 'zod';

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  workspaceId: z
    .string({
      message: 'WorkspaceId is required',
    })
    .uuid({
      message: 'WorkspaceId must be a valid uuid',
    }),
  ownerId: z.string().uuid(),
  type: z.enum(['channel', 'dm', 'group']),
  createdAt: z.date(),
});

export type TConversation = z.infer<typeof ConversationSchema>;

export type TConversationsQueryResult = {
  type: string;
  conversations: Pick<TConversation, 'id' | 'name'>[];
};

export const GetConversationsListQuerySchema = ConversationSchema.pick({
  workspaceId: true,
});

export type TGetConversationsListQuery = z.infer<
  typeof GetConversationsListQuerySchema
>;

const MessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  senderId: z.string().uuid(),
  conversationId: z.string().uuid(),
  createdAt: z.date(),
});
export type TMessage = z.infer<typeof MessageSchema>;
export type TMessagesQueryResult = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    fullName: string;
  };
};

export const CreateMessageSchema = MessageSchema.pick({
  content: true,
});
export type TCreateMessage = z.infer<typeof CreateMessageSchema>;


// Create Conversation Schema & DTO
export const CreateConversationSchema = ConversationSchema.pick({
  name: true,
  type: true,
  workspaceId: true,
}).extend({
  members: z.array(z.string().uuid()),
  ownerId: z.string().uuid().optional(),
});

export type TCreateConversation = z.infer<typeof CreateConversationSchema>;
export type TCreateConversationWithOwner = TCreateConversation & { ownerId: string };
