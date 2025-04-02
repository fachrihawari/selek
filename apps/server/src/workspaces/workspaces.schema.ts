import { z } from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: 'Name is required' }),
  logo_url: z.string().optional(),
  owner_id: z
    .string({ message: 'Owner Id is required' })
    .uuid({ message: 'Owner Id is invalid' }),
  created_at: z.date(),
  updated_at: z.date(),
});
export type TWorkspace = z.infer<typeof WorkspaceSchema>;

export const CreateWorkspaceBodySchema = WorkspaceSchema.pick({
  name: true,
  logo_url: true,
});
export type TCreateWorkspaceBody = z.infer<typeof CreateWorkspaceBodySchema>;
