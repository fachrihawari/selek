DROP TABLE IF EXISTS conversation_members CASCADE;
DROP TYPE IF EXISTS conversation_members_role;

-- Create conversation_members_role enum
CREATE TYPE conversation_members_role AS ENUM ('owner', 'member');

-- Create conversation members junction table
CREATE TABLE IF NOT EXISTS conversation_members (
    "conversationId" UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "role" conversation_members_role NOT NULL,
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("conversationId", "userId")
);


