# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Budget Book is a personal finance management application built as a monorepo with two main packages:

- **bbserver**: NestJS-based GraphQL API server
- **bbclient**: Next.js 15 frontend application

The application uses cookie-based JWT authentication, allowing users to track financial transactions across multiple bank accounts with detailed categorization.

## Monorepo Structure

This is a pnpm workspace monorepo. All packages are located in `packages/`:

- `packages/bbserver/`: Backend API server
- `packages/bbclient/`: Frontend web application

## Common Commands

### Root Level

```bash
# Install all dependencies
pnpm install

# Lint all packages
pnpm lint

# Lint and fix
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Backend (bbserver)

```bash
cd packages/bbserver

# Development
pnpm start:dev          # Start with hot-reload
pnpm start:debug        # Start in debug mode

# Production
pnpm build              # Compile TypeScript
pnpm start:prod         # Run production build

# Database (Prisma)
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Run migrations in development
npx prisma studio       # Open Prisma Studio GUI

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests
```

### Frontend (bbclient)

```bash
cd packages/bbclient

# Development
pnpm dev                # Start dev server on port 3030

# Production
pnpm build              # Build for production
pnpm start              # Start production server

# Linting
pnpm lint               # Run Next.js linter
```

## Architecture

### Backend (bbserver)

**Framework**: NestJS with GraphQL (Apollo Server)

**Database**: PostgreSQL with Prisma ORM

**Authentication**: JWT tokens stored in HTTP-only cookies. The authentication flow:

1. User logs in via GraphQL mutation
2. Server generates JWT and sets it as an HTTP-only cookie
3. Client includes cookie automatically on subsequent requests
4. Server validates JWT via Passport JWT strategy

**Module Structure**:

- `Auth/`: Authentication (login, register) with JWT strategy
- `User/`: User management
- `Account/`: Bank account management (supports multiple accounts per user)
- `Transaction/`: Financial transaction operations (INCOME, EXPENSE, TRANSFER)
- `Prisma/`: Database service wrapper
- `common/`: Shared utilities
  - `decorators/`: Custom decorators (e.g., `@CurrentUser`)
  - `log/`: Winston-based logging with daily rotation
  - `interceptor.ts`: Request/response logging
  - `dto/`: Data transfer objects
  - `type/`: GraphQL type definitions

**Key Files**:

- `src/main.ts`: Application bootstrap with CORS configuration
- `src/app.module.ts`: Root module with GraphQL configuration
- `src/schema.gql`: Auto-generated GraphQL schema (dev mode only)
- `prisma/schema.prisma`: Database schema

**Data Model**:

- `User`: User accounts with roles (USER, ADMIN) and status
- `Account`: Bank accounts with multiple balance types (total, available, saving, fixed deposit, investment, hold)
- `Transaction`: Financial transactions with type (INCOME/EXPENSE/TRANSFER), category, payment method, and account relationships

### Frontend (bbclient)

**Framework**: Next.js 15 (App Router) with React 19

**GraphQL Client**: Apollo Client with authentication and error handling

**Authentication Flow**:

- JWT token stored in HTTP-only cookie
- `middleware.ts` protects routes: redirects to `/authentication` if not logged in
- Apollo Client includes token via `authLink` and handles 401 errors via `errorLink`
- Automatic redirect to login on authentication failure

**Directory Structure**:

- `src/app/`: Next.js App Router pages
  - `authentication/`: Login/register pages
  - `transaction/`: Transaction management pages
  - `protected.tsx`: HOC for protected routes
- `src/components/`: Reusable React components
- `src/graphql/`: GraphQL queries and mutations
  - `queries/`: GraphQL query definitions
  - `mutations/`: GraphQL mutation definitions
- `src/lib/`: Client configuration
  - `apolloClient.ts`: Apollo Client setup with auth and error handling
- `src/middleware.ts`: Next.js middleware for route protection
- `src/model/`: TypeScript types and interfaces
- `src/constants/`: Application constants

**Apollo Client Configuration**:

- Reads JWT from cookie and adds to Authorization header
- Handles UNAUTHENTICATED errors by clearing cookie and redirecting
- Handles network 401 errors similarly

## Important Notes

### Authentication

- Auth uses cookie-based JWT (not localStorage/sessionStorage)
- Server sets cookies with SameSite and Secure flags
- Client middleware checks for `token` cookie
- Apollo Client automatically includes cookie in GraphQL requests

### Database Migrations

When modifying Prisma schema:

1. Update `packages/bbserver/prisma/schema.prisma`
2. Run `npx prisma migrate dev` to create and apply migration
3. Run `npx prisma generate` to update Prisma Client

### GraphQL Schema

In development, GraphQL schema is auto-generated at `src/schema.gql`. In production, the schema is read from a file.

### CORS Configuration

Backend CORS is configured to allow specific Vercel deployment URLs. Update `src/main.ts` if adding new frontend domains.

### Logging

Server uses Winston logger with:

- Console output (colorized in development)
- Daily rotating file logs
- Request/response logging via interceptor

### Environment Variables

Both packages require environment variables. Key variables:

**bbserver**:

- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: Direct database URL (for Prisma migrations)
- `JWT_SECRET`: Secret for JWT signing
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

**bbclient**:

- `NEXT_PUBLIC_GRAPHQL_API`: GraphQL API endpoint URL
