DROP TABLE IF EXISTS workspace_members CASCADE;

-- Create workspace members junction table
CREATE TABLE IF NOT EXISTS workspace_members (
    "workspaceId" UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(6) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("workspaceId", "userId")
);

-- Index for frequent user-based lookups
CREATE INDEX workspace_members_user_idx ON workspace_members("userId");

-- Index for workspace membership queries
CREATE INDEX workspace_members_workspace_idx ON workspace_members("workspaceId");