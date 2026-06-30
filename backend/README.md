# Task Manager Backend

Full-stack task manager backend built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 20, TypeScript
- **Framework**: Express.js 4
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT in httpOnly cookies
- **Validation**: Zod

## Project Structure

```
src/
├── controllers/       # Request handlers
├── middleware/        # Express middleware
├── routes/           # API routes
├── types/            # TypeScript types
├── utils/            # Utility functions
├── app.ts            # Express app setup
└── server.ts         # Server entry point
prisma/
├── schema.prisma     # Database schema
└── migrations/       # DB migrations
```

## API Endpoints

### Authentication Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout (protected)
- `GET /auth/me` - Get current user (protected)

### Task Routes (all protected)
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### 3. Setup Database

Ensure PostgreSQL is running and update `DATABASE_URL` in `.env`.

Run migrations:

```bash
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Key Features

✅ User registration with hashed passwords  
✅ JWT authentication with httpOnly cookies  
✅ Task CRUD with ownership verification  
✅ Status filtering (ACTIVE/COMPLETED)  
✅ Global error handling  
✅ CORS with frontend origin  
✅ Type-safe with TypeScript + Prisma  

## Database Schema

### User
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `createdAt`, `updatedAt`

### Task
- `id` (UUID)
- `userId` (FK to User)
- `title` (required)
- `description` (optional)
- `status` (ACTIVE or COMPLETED)
- `createdAt`, `updatedAt`

## Testing Endpoints

### Register User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login User

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Task

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"My Task","description":"Task description"}'
```

### Get All Tasks

```bash
curl -X GET http://localhost:3001/api/tasks \
  -b cookies.txt
```

## Notes

- All protected routes require valid JWT token in httpOnly cookie
- Each task is verified to belong to the authenticated user before modification
- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days

