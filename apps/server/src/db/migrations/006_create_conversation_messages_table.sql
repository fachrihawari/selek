DROP TABLE IF EXISTS conversation_messages CASCADE;

-- Create conversation_messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    "senderId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "content" TEXT, -- Optional for messages with only media
    "media" JSONB, -- JSONB column to store media information
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_content_or_media CHECK (
        ("content" IS NOT NULL AND "media" IS NULL) OR
        ("content" IS NULL AND "media" IS NOT NULL) OR
        ("content" IS NOT NULL AND "media" IS NOT NULL)
    )
);

-- Create a function to validate the media JSONB structure
CREATE OR REPLACE FUNCTION validate_media_structure()
RETURNS TRIGGER AS $$
BEGIN
    -- If media is not NULL, validate its structure
    IF NEW.media IS NOT NULL THEN
        -- Ensure media is an array
        IF jsonb_typeof(NEW.media) <> 'array' THEN
            RAISE EXCEPTION 'media must be a JSON array';
        END IF;

        -- Ensure each object in the array has 'type' and 'url' keys
        FOR i IN 0..jsonb_array_length(NEW.media) - 1 LOOP
            IF NOT (NEW.media->i ? 'type' AND NEW.media->i ? 'url') THEN
                RAISE EXCEPTION 'Each media object must contain "type" and "url" keys';
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the validation function before INSERT or UPDATE
CREATE TRIGGER validate_media_trigger
BEFORE INSERT OR UPDATE ON conversation_messages
FOR EACH ROW
EXECUTE FUNCTION validate_media_structure();

-- Create an index on the conversationId column for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversationId ON conversation_messages("conversationId");