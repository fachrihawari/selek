DROP TABLE IF EXISTS workspace_members CASCADE;

-- Create workspace members junction table
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (workspace_id, user_id)
);

-- Index for frequent user-based lookups
CREATE INDEX workspace_members_user_idx ON workspace_members(user_id);

-- Index for workspace membership queries
CREATE INDEX workspace_members_workspace_idx ON workspace_members(workspace_id);