# Lessons learned from the project

## Server Logging

- Use warn when a user attempts an unauthorized or forbidden action (like joining a workspace they are not a member of).
- Use error for unexpected failures, exceptions, or situations where the system cannot continue or something is broken.