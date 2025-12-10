# Nodebase

A complete workflow automation platform that enables users to build visual workflows, integrate multiple triggers, leverage AI providers, run background jobs, and deploy a production-ready SaaS with authentication, payments, and monitoring.

## Overview

Nodebase is a no-code workflow automation platform built with modern web technologies. Users can create complex automation workflows through an intuitive drag-and-drop interface, connecting various services and AI providers to automate business processes.

## Key Features

### 🎨 Visual Workflow Builder

- **Drag-and-drop interface** powered by React Flow
- Intuitive node-based workflow design
- Real-time workflow visualization
- Topological sorting for proper execution order

### 🔔 Trigger Nodes

- **Manual Trigger**: Execute workflows on-demand
- **Webhook Trigger**: Receive HTTP webhooks from external services
- **Google Form Trigger**: Automatically trigger workflows on form submissions
- **Stripe Trigger**: React to Stripe payment events

### 🤖 AI Integrations

- **OpenAI**: GPT models for text generation and analysis
- **Anthropic Claude**: Advanced AI capabilities
- **Google Gemini**: Multimodal AI processing

### 💬 Messaging Nodes

- **Discord**: Send messages and notifications to Discord channels
- **Slack**: Integrate with Slack workspaces

### 🔧 Utility Nodes

- **HTTP Request**: Make custom API calls to any service
- **Initial Node**: Starting point for workflow execution

### ⚙️ Background Job Execution

- Powered by **Inngest** for reliable, scalable background processing
- Real-time execution status updates
- Error handling and retry logic
- Execution history and monitoring

### 💳 Payments & Subscriptions

- Integrated with **Polar** for subscription management
- Premium features gated behind subscriptions
- Customer portal and checkout flows

### 🔐 Authentication

- **Better Auth** for secure user authentication
- Email/password authentication
- Social login (GitHub, Google)
- Session management

### 📊 Monitoring & Observability

- **Sentry** integration for error tracking
- Real-time execution monitoring
- Execution logs and error reporting

## Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-000000?style=for-the-badge&logo=inngest&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=Sentry&logoColor=white)

</div>

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development

### Backend & API

- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database

### Background Jobs

- **Inngest** - Reliable background job processing
- **Inngest Realtime** - Real-time execution updates

### Authentication & Payments

- **Better Auth** - Authentication framework
- **Polar** - Subscription and payment management

### UI & Design

- **React Flow** - Workflow canvas and node editor
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI & Integrations

- **Vercel AI SDK** - Unified AI provider interface
- **@ai-sdk/openai** - OpenAI integration
- **@ai-sdk/anthropic** - Anthropic Claude integration
- **@ai-sdk/google** - Google Gemini integration

### Development Tools

- **Biome** - Fast linter and formatter
- **mprocs** - Process management for development

### Monitoring

- **Sentry** - Error tracking and performance monitoring

## Folder Structure

```
nodebase/
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Prisma schema definition
│   └── migrations/             # Database migration history
├── public/                     # Static assets
│   └── images/                 # Image assets
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Dashboard pages
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── react-flow/         # React Flow custom components
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication features
│   │   ├── credentials/        # Credential management
│   │   ├── editor/             # Workflow editor
│   │   ├── executions/         # Execution management
│   │   ├── triggers/           # Trigger components
│   │   └── workflows/          # Workflow management
│   ├── inngest/                # Inngest functions and channels
│   │   ├── channels/           # Node-specific execution channels
│   │   ├── client.ts           # Inngest client configuration
│   │   └── function.ts         # Main workflow execution function
│   ├── lib/                    # Shared utilities
│   │   ├── auth/               # Authentication configuration
│   │   ├── db.ts               # Prisma client
│   │   ├── encryption.ts       # Credential encryption
│   │   └── polar.ts            # Polar client
│   └── trpc/                   # tRPC configuration
│       └── routers/            # tRPC route definitions
├── biome.json                  # Biome linter/formatter config
├── components.json             # shadcn/ui components config
├── mprocs.yaml                 # Process management config
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies and scripts
```

## Setup & Installation

### Prerequisites

- **Node.js** 20 or higher
- **PostgreSQL** database
- **Inngest** account (for background jobs)
- **Polar** account (for payments, optional)

### Installation Steps

1. **Clone the repository**

      ```bash
      git clone https://github.com/hha297/Nodebase.git
      cd nodebase
      ```

2. **Install dependencies**

      ```bash
      npm install
      ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

      ```env
      # Database
      DATABASE_URL="postgresql://user:password@localhost:5432/nodebase"

      # Authentication
      BETTER_AUTH_SECRET="your-secret-key"
      BETTER_AUTH_URL="http://localhost:3000"

      # Social Auth (optional)
      GITHUB_CLIENT_ID="your-github-client-id"
      GITHUB_CLIENT_SECRET="your-github-client-secret"
      GOOGLE_CLIENT_ID="your-google-client-id"
      GOOGLE_CLIENT_SECRET="your-google-client-secret"

      # Encryption
      ENCRYPTION_KEY="your-encryption-key-min-32-chars"

      # Inngest
      INNGEST_EVENT_KEY="your-inngest-event-key"
      INNGEST_SIGNING_KEY="your-inngest-signing-key"

      # Polar (optional, for payments)
      POLAR_ACCESS_TOKEN="your-polar-access-token"
      POLAR_SUCCESS_URL="http://localhost:3000/success"

      # Sentry (optional, for monitoring)
      SENTRY_DSN="your-sentry-dsn"
      SENTRY_ORG="your-sentry-org"
      SENTRY_PROJECT="nodebase"

      # ngrok (optional, for webhook testing)
      NGROK_URL="your-ngrok-domain"
      ```

4. **Set up the database**

      ```bash
      npx prisma generate
      npx prisma migrate dev
      ```

5. **Run the development server**

      ```bash
      npm run dev
      ```

      Or run all services (Next.js, Inngest, ngrok) together:

      ```bash
      npm run dev:all
      ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run inngest:dev` - Start Inngest development server
- `npm run ngrok:dev` - Start ngrok tunnel for webhook testing
- `npm run dev:all` - Run all development services concurrently

### Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma`, then run `npx prisma migrate dev`
2. **New Features**: Add feature modules in `src/features/`
3. **New Nodes**: Create executor in `src/features/executions/components/` and add channel in `src/inngest/channels/`
4. **API Routes**: Add tRPC procedures in `src/trpc/routers/`

## Security

### API Credential Security

Nodebase implements robust security measures for storing sensitive API credentials:

- **Encryption at Rest**: All AI provider API keys (OpenAI, Anthropic, Gemini) are encrypted using AES-256 encryption before being stored in the database
- **Client-Side Protection**: Encrypted credentials are never exposed to the client-side code. Only credential metadata (name, type) is sent to the frontend
- **Server-Side Decryption**: Credentials are decrypted only on the server during workflow execution, ensuring they never leave the secure backend environment
- **Environment Variables**: Sensitive configuration values are stored as environment variables and never committed to version control

### Security Best Practices

- All API routes are protected with authentication middleware
- User data is isolated per user account
- Database queries use parameterized statements via Prisma
- Session tokens are securely managed by Better Auth
- CORS and security headers are configured via Next.js

## Architecture Details

### Workflow Execution Flow

1. **Trigger**: Workflow execution is triggered via:

      - Manual execution from UI
      - Webhook endpoint (`/api/webhooks/*`)
      - Scheduled events (future)

2. **Event Creation**: Execution request creates an Inngest event with workflow ID

3. **Topological Sort**: Nodes are sorted topologically to determine execution order

4. **Sequential Execution**: Nodes execute in order, with each node receiving context from previous nodes

5. **Status Updates**: Execution status is updated in real-time via Inngest Realtime

6. **Error Handling**: Failed executions are tracked with error messages and stack traces

### Node Execution System

Each node type has:

- **Executor Function**: Server-side logic for node execution
- **Channel**: Inngest channel for async operations
- **UI Component**: React component for node configuration
- **Dialog Component**: Form for configuring node parameters

### Credential Management

- Credentials are encrypted using `cryptr` library
- Encryption key is stored in `ENCRYPTION_KEY` environment variable
- Credentials are linked to nodes via `credentialId` foreign key
- Only premium users can create credentials (enforced via `premiumProcedure`)

## License

This project is private and proprietary.

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

Built with ❤️ using Next.js, React, TypeScript, and modern web technologies.
