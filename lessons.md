# Lessons learned from the project

## Server Logging

There are several levels of logging that we can use in the server, in this project I figured when to use each level, especially in the context of user actions and system events.

Key points:
- Use debug for detailed information that is useful during development or debugging, but not needed in production, such as when a user connects or joins a room.
- Use warn for situations that are unexpected but not necessarily errors, such as a user attempts an unauthorized or forbidden action (like accessing a resource they don't have permission for).
- Use error for unexpected failures, exceptions, or situations where the system cannot continue or something is broken.
- Actually there are more levels like verbose, info, etc. but I don't use them in this project.

## DB Postgres

JSON features in postgres is really powerful, make me think that I can use it to store more complex data structures without needing to create additional tables or using non-relational databases.

Key points:
- We can use JSONB to store JSON data in a binary format, which is more efficient for storage and querying.
- We can build a json using JSON_BUILD_OBJECT 
- We can aggregate multiple rows into a single JSON array using JSON_AGG