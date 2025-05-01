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

export type TWorkspaceQueryResult = (Pick<TWorkspace, 'id' | 'name' | 'logoUrl' | 'ownerId'> & {
  memberCount: number;
});

// Workspace schema for creating a new workspace
export const CreateWorkspaceSchema = WorkspaceSchema.pick({
  name: true,
  logoUrl: true,
});
export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceSchema>;