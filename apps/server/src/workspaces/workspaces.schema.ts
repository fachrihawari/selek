import { z } from 'zod';

// Base workspace schema
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Workspace Name is required' }).min(3, {
    message: 'Workspace Name must be at least 3 characters',
  }),
  logoUrl: z.string().default(''),
  ownerId: z.string().uuid(),
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
