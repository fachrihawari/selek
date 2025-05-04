DROP TABLE IF EXISTS members CASCADE;


-- Create members junction table
CREATE TABLE IF NOT EXISTS members (
    -- entity id & type 
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(6) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("workspaceId", "userId")
);

-- Index for frequent user-based lookups
CREATE INDEX members_user_idx ON members("userId");

-- Index for workspace membership queries
CREATE INDEX members_workspace_idx ON members("workspaceId");
