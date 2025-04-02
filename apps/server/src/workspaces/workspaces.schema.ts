import { z } from 'zod';

// Base workspace schema
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Name is required' }),
  logoUrl: z.string().default(''),
  ownerId: z
    .string({ message: 'Owner Id is required' })
    .uuid({ message: 'Owner Id is invalid' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TWorkspace = z.infer<typeof WorkspaceSchema>;

// Workspace schema for creating a new workspace
export const CreateWorkspaceBodySchema = WorkspaceSchema.pick({
  name: true,
  logoUrl: true,
});
export type TCreateWorkspaceBody = z.infer<typeof CreateWorkspaceBodySchema>;
