---
applyTo: '**'
---

# Slack Clone Project - Development Guidelines

I'm building a real-time messaging application (Slack clone) with the following architecture:

## Tech Stack

### Server (apps/server/)
- **Runtime**: Node.js with Bun package manager
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with postgres.js driver
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT-based auth system
- **Testing**: Jest for unit and e2e tests
- **Code Quality**: ESLint with custom configuration

### Client (apps/client/)
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v7
- **Styling**: TailwindCSS for utility-first CSS
- **Data Fetching**: SWR for server state management
- **Icons**: React Icons library
- **Real-time**: Socket.IO client
- **Build Tool**: Vite
- **Code Quality**: Biome for linting and formatting

## Core Features
- **Workspaces**: Multi-tenant workspace system
- **Conversations**: Channels and direct messages
- **Real-time Messaging**: Live chat with Socket.IO
- **User Authentication**: Registration, login, and session management
- **File Sharing**: Media and document uploads
- **Notifications**: In-app and browser notifications

## Development Guidelines

### Code Quality & Structure
- Follow **clean architecture** principles with clear separation of concerns
- Use **TypeScript strictly** - avoid `any` types, prefer interfaces and type safety
- Implement **proper error handling** with try-catch blocks and meaningful error messages
- Write **self-documenting code** with clear variable/function names
- Add comments for complex business logic, not obvious code
- Follow **consistent naming conventions**: camelCase for variables/functions, PascalCase for classes/components

### Server-Side Best Practices
- Use **NestJS decorators** (@Injectable, @Controller, @Get, etc.) appropriately
- Implement **DTOs and validation** using Zod for all endpoints
- Use **Guards** for authentication and authorization
- Implement **proper database migrations** in the migrations folder
- Use **transactions** for multi-step database operations
- Follow **RESTful API design** principles
- Implement **rate limiting** and security middleware
- Use **environment variables** for configuration

### Client-Side Best Practices
- Create **reusable components** in the components folder
- Use **custom hooks** for shared logic and state management
- Implement **proper error boundaries** and loading states
- Use **TailwindCSS utilities** instead of custom CSS when possible
- Follow **React best practices**: functional components, proper key props, useEffect cleanup
- Implement **responsive design** for mobile and desktop
- Use **SWR patterns** for data fetching with proper cache management
- Handle **real-time updates** efficiently with Socket.IO

### Database & API Guidelines
- Use **postgres.js** for all database interactions
- Implement **prepared statements** to prevent SQL injection
- Use **proper indexing** for performance optimization
- Follow **database naming conventions**: snake_case for tables/columns
- Implement **soft deletes** for important data
- Use **UUID** for primary keys when appropriate
- Design **normalized database schema** with proper relationships

### Real-time Features
- Use **Socket.IO rooms** for workspace and conversation isolation
- Implement **proper connection handling** with reconnection logic
- Handle **user presence** and typing indicators
- Ensure **message delivery** with acknowledgments
- Implement **rate limiting** for socket events

### Package Management
- Use **Bun** as the package manager for all operations
- Ensure all suggested dependencies are **Bun-compatible**
- Use **workspace configuration** for monorepo dependency management
- Pin **exact versions** for critical dependencies

## Request Guidelines

When I ask for help:
1. **Provide complete, working code snippets** with necessary imports and context
2. **Include error handling** and edge cases
3. **Add TypeScript types** for all functions and components
4. **Follow the existing project structure** and patterns
5. **Suggest the most efficient solution** unless I request alternatives
6. **Ask clarifying questions** if requirements are unclear
7. **Consider security implications** for all server-side code
8. **Ensure accessibility** for all UI components

## File Organization Patterns
- Group related files by feature (conversations/, workspaces/, etc.)
- Use index.ts files for clean exports
- Separate interfaces, types, and constants into dedicated files
- Keep components focused and single-responsibility
- Use descriptive file naming: feature-action.type.ts

## Testing Requirements
- Include **integration tests** for API endpoints
- Test **real-time functionality** with proper mocking
- Ensure **type safety** in test files
- Use **descriptive test names** that explain the scenario

Please prioritize code quality, maintainability, and performance in all suggestions.
