# Selek

A real-time messaging application (Slack clone) built with modern web technologies, featuring workspaces, channels, direct messages, and real-time communication.

## 🏗️ Architecture

Selek is built as a monorepo containing two main applications:

### Server (`apps/server/`)
- **Runtime**: Bun (JavaScript runtime)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with postgres.js driver
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT-based auth system
- **Testing**: Jest for unit and e2e tests
- **Code Quality**: ESLint with custom configuration

### Client (`apps/client/`)
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v7 (SPA mode)
- **Styling**: TailwindCSS for utility-first CSS
- **Data Fetching**: SWR for server state management
- **Icons**: React Icons library
- **Real-time**: Socket.IO client
- **Build Tool**: Vite
- **Code Quality**: Biome for linting and formatting

## 🚀 Features

- **Multi-tenant Workspaces**: Create and manage multiple workspaces
- **Real-time Messaging**: Live chat with Socket.IO
- **Conversation Types**: Channels, group messages, and direct messages
- **User Authentication**: Registration, login, and JWT-based sessions
- **Workspace Management**: Add/remove members with role-based permissions
- **Responsive Design**: Mobile and desktop optimized
- **TypeScript**: Full type safety across the stack

## 📋 Prerequisites

- [Bun](https://bun.sh/) (v1.2.19 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fachrihawari/selek.git
   cd selek
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/server/.env.example apps/server/.env
   cp apps/client/.env.example apps/client/.env
   ```

4. **Configure environment variables**

   **Server `.env` (`apps/server/.env`):**
   ```bash
   DATABASE_URL=postgres://localhost:5432/selek
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRATION=1d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   **Client `.env` (`apps/client/.env`):**
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

5. **Set up the database**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE selek;"
   
   # Run migrations
   bun run --filter "server" migrate
   
   # Seed database (optional)
   bun run --filter "server" seed
   ```

## 🏃‍♂️ Running the Application

**Start both applications:** 
```bash
# Server only (http://localhost:3000)
bun run --filter "server" dev

# Client only (http://localhost:5173)
bun run --filter "client" dev
```

## 🧪 Linting & Testing

### Server

```bash
cd apps/server

# Linting and formatting
bun run lint

# E2E tests
bun run test:e2e
```

### Client

```bash
cd apps/client

# Type checking
bun run typecheck

# Linting and formatting
bun run tidy
```

## 🐳 Docker Deployment

The project includes Docker support for both applications:

### Using Docker Compose

```bash
# Build and start services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

## 📁 Project Structure

```
selek/
├── apps/
│   ├── client/                 # React frontend application
│   │   ├── src/
│   │   │   ├── auth/          # Authentication pages and logic
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── conversations/ # Chat functionality
│   │   │   ├── shared/        # Shared utilities and contexts
│   │   │   ├── users/         # User-related interfaces
│   │   │   └── workspaces/    # Workspace management
│   │   ├── public/            # Static assets
│   │   └── nginx/             # Nginx configuration for Docker
│   │
│   └── server/                # NestJS backend application
│       ├── src/
│       │   ├── auth/          # Authentication module
│       │   ├── conversations/ # Chat and messaging module
│       │   ├── db/            # Database configuration and migrations
│       │   ├── shared/        # Shared utilities and middleware
│       │   ├── users/         # User management module
│       │   └── workspaces/    # Workspace management module
│       └── test/              # E2E tests
│
├── docker-compose.yml         # Docker orchestration
├── package.json              # Workspace configuration
└── README.md                 # This file
```

## 🔧 Development Scripts

### Server Scripts
```bash
bun run --filter "server" dev          # Development mode
bun run --filter "server" build        # Build for production
bun run --filter "server" start        # Production mode
bun run --filter "server" test:e2e     # E2E tests
bun run --filter "server" migrate      # Run database migrations
bun run --filter "server" seed         # Seed database
bun run --filter "server" lint         # Lint code
```

### Client Scripts
```bash
bun run --filter "client" dev          # Development mode
bun run --filter "client" build        # Build for production
bun run --filter "client" start:prod   # Production mode
bun run --filter "client" typecheck    # Type checking
bun run --filter "client" tidy         # Lint and format
```

## 🔐 Authentication & Authorization

### JWT Authentication
- JWT tokens for stateless authentication
- Configurable expiration time
- Secure password hashing with bcrypt

### Role-Based Access Control
- **Workspace Roles**: owner, admin, member
- **Conversation Roles**: owner, member
- Permission-based route protection

### API Authentication

We use Bearer tokens for API authentication.
```javascript
//  Include the JWT token in the `Authorization`
Authorization: Bearer <jwt_token>
```

## 🌐 Real-time Features

### Socket.IO Integration
- Real-time message delivery
- User presence indicators
- Room-based message isolation
- Connection state management

## 🎨 UI/UX Features

### Design System
- Consistent color scheme (Orange primary theme)
- TailwindCSS utility classes
- Responsive design patterns
- Loading states and error handling

### User Experience
- Toast notifications for user feedback
- Infinite scroll for message history
- Optimistic UI updates
- Keyboard navigation support
- Sound notifications

## 🔧 Configuration

### Environment Variables

**Required for Server:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRATION`: Token expiration time
- `CLIENT_URL`: Frontend application URL

**Required for Client:**
- `VITE_API_URL`: Backend API URL

**Optional:**
- `NODE_ENV`: Environment mode (development/production/test)
- `PORT`: Server port (default: 3000)

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure PostgreSQL connection
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS origins
- [ ] Set up monitoring and logging

### Recommended Platforms
- **Server**: Railway, Render, Heroku, DigitalOcean
- **Client**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: PostgreSQL on Railway, Heroku Postgres, DigitalOcean Managed Databases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting checks
- Update documentation as needed

## 📝 License

This project is licensed under the UNLICENSED license. See the package.json files for more details.

## 👥 Author

**Fachri Hawari** - [fachri.hawari@gmail.com](mailto:fachri.hawari@gmail.com)