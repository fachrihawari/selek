DROP TABLE IF EXISTS conversations CASCADE;

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "ownerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "workspaceId" UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    "members" UUID[] DEFAULT '{}', -- Array of user UUIDs
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for workspace membership queries
CREATE INDEX conversations_workspace_idx ON conversations("workspaceId");