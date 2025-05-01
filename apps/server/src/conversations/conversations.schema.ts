import { z } from "zod";

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Name is required' }).min(3, {
    message: 'Name must be at least 3 characters',
  }),
  workspaceId: z.string({
    message: 'WorkspaceId is required',
  }).uuid({
    message: 'WorkspaceId must be a valid uuid',
  }),
  members: z.array(z.string().uuid()),
  ownerId: z.string().uuid(),
  type: z.enum(['channel', 'dm', 'group']),
  createdAt: z.date(),
});

export type TConversation = z.infer<typeof ConversationSchema>;

export type TConversationsQueryResult = {
  type: string;
  conversations: Pick<TConversation, 'id' | 'name'>[];
};

// DTO
export const GetConversationsListQuerySchema = ConversationSchema.pick({
  workspaceId: true,
});

export type TGetConversationsListQuery = z.infer<typeof GetConversationsListQuerySchema>;