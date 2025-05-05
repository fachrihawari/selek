DROP TABLE IF EXISTS conversations CASCADE;
DROP TYPE IF EXISTS conversation_type;

-- Create conversation_type enum
CREATE TYPE conversation_type AS ENUM ('dm', 'group', 'channel');

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "ownerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "workspaceId" UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    "type" conversation_type NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for workspace membership queries
CREATE INDEX conversations_workspace_idx ON conversations("workspaceId");