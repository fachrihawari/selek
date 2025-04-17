DROP TABLE IF EXISTS workspace_channels CASCADE;

-- Create workspace_channels table
CREATE TABLE IF NOT EXISTS workspace_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "ownerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "workspaceId" UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    "members" UUID[] DEFAULT '{}', -- Array of user UUIDs
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for workspace membership queries
CREATE INDEX workspace_channels_workspace_idx ON workspace_channels("workspaceId");