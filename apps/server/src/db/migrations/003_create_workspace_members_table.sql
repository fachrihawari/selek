DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TYPE IF EXISTS workspace_members_role;

-- Create workspace_members_role enum
CREATE TYPE workspace_members_role AS ENUM ('owner', 'admin', 'member');

-- Create workspace members junction table
CREATE TABLE IF NOT EXISTS workspace_members (
    "workspaceId" UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "role" workspace_members_role NOT NULL,
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("workspaceId", "userId")
);

