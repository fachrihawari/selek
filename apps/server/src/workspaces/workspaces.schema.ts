import { z } from 'zod';

// Base workspace schema
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Name is required' }).min(3, {
    message: 'Name must be at least 3 characters',
  }),
  logoUrl: z.string().default(''),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TWorkspace = z.infer<typeof WorkspaceSchema>;

export type TWorkspacesQueryResult = (Pick<TWorkspace, 'id' | 'name' | 'logoUrl' | 'ownerId'> & {
  memberCount: number;
});

// Workspace schema for creating a new workspace
export const CreateWorkspaceBodySchema = WorkspaceSchema.pick({
  name: true,
  logoUrl: true,
});
export type TCreateWorkspaceBody = z.infer<typeof CreateWorkspaceBodySchema>;

// Workspace Channel schema
export const ConversationSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Conversation Name is required' }).min(3, {
    message: 'Conversation Name must be at least 3 characters',
  }),
  workspaceId: z.string().uuid(),
  members: z.array(z.string().uuid()),
  ownerId: z.string().uuid(),
  type: z.enum(['channels', 'dms', 'group']),
  createdAt: z.date(),
});

export type TConversation = z.infer<typeof ConversationSchema>;

export type TConversationsQueryResult = Pick<TConversation, 'id' | 'name' | 'type'>[];
