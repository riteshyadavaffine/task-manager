# CRUD Task Manager - Setup Guide

Complete step-by-step instructions to get the full-stack application running locally.

## Prerequisites

- **Node.js** 18+ (download from https://nodejs.org/)
- **PostgreSQL** (download from https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)

## Step 1: Setup Database

### 1.1 Start PostgreSQL
Ensure PostgreSQL is running on your local machine.

### 1.2 Create Database (Optional)
```bash
# Using psql
psql -U postgres
CREATE DATABASE task_manager;
\q
```

Or you can let Prisma create it automatically.

### 1.3 Update Connection String
Edit `backend/.env` to point to your PostgreSQL instance:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_manager"
```

Replace:
- `postgres` with your PostgreSQL username
- `password` with your PostgreSQL password
- `localhost:5432` with your server host/port

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Generate Prisma Client
```bash
npm run prisma:generate
```

### 2.3 Run Database Migrations
```bash
npm run prisma:migrate
```

When prompted, name the migration (e.g., "init" or "create_user_task")

### 2.4 Start Backend Development Server
```bash
npm run dev
```

**Expected output:**
```
Server running on http://localhost:3001
```

✅ **Backend is running!** Leave it running and open a new terminal.

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

### 3.2 Start Frontend Development Server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Frontend is running!** Open browser to http://localhost:5173/

## Step 4: Test the Application

### 4.1 Register User
1. Click "Register" link if on login page
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Register"

✅ Should redirect to task board

### 4.2 Create a Task
1. Click "+ New Task" button
2. Enter title: `My First Task`
3. Enter description: `This is my first task`
4. Click "Create"

✅ Task appears in the list

### 4.3 Complete a Task
1. Click "Complete" button on task
2. Task status changes to "COMPLETED"

✅ Button now shows "Reopen"

### 4.4 Filter Tasks
1. Click "Completed" filter button
2. Only completed tasks shown
3. Click "Active" to see active tasks
4. Click "All" to see all tasks

✅ Filtering works

### 4.5 Edit a Task
1. Click "Edit" button on a task
2. Modify title or description
3. Click "Update"

✅ Task updated

### 4.6 Delete a Task
1. Click "Delete" button
2. Confirm deletion

✅ Task removed

### 4.7 Logout
1. Click "Logout" button in header
2. Redirected to login page

✅ Session cleared

### 4.8 Login Again
1. Enter same email/password
2. Tasks still exist (persisted in database)

✅ Authentication working

## Troubleshooting

### PostgreSQL Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify username/password

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**:
- Change PORT in `backend/.env` (e.g., PORT=3002)
- Or kill the process using port 3001

### Node Modules Issues
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma Migration Fails
**Solution**:
```bash
npm run prisma:migrate -- --skip-generate
```

## Project Structure (Summary)

```
task-manager/
├── backend/              # Express API (runs on :3001)
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & error handling
│   │   ├── routes/       # API endpoints
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # JWT & password utilities
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── .env              # Database connection
│   └── package.json
│
└── frontend/             # React app (runs on :5173)
    ├── src/
    │   ├── api/          # Axios HTTP client
    │   ├── components/   # UI components
    │   ├── context/      # Auth state
    │   ├── pages/        # Page components
    │   └── types/        # TypeScript types
    ├── index.html
    └── package.json
```

## Quick Commands Reference

### Backend
```bash
cd backend
npm run dev              # Start dev server
npm run build            # Compile TypeScript
npm start                # Run production build
npm run prisma:migrate   # Create database migration
npm run prisma:studio    # Open Prisma Studio (GUI)
npm run prisma:generate  # Generate Prisma client
```

### Frontend
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## Next Steps

1. Read `backend/README.md` for detailed API documentation
2. Read `frontend/README.md` for frontend details
3. Check `TESTING.md` for advanced testing with curl
4. Explore the codebase:
   - Backend auth flow in `backend/src/controllers/auth.controller.ts`
   - Task CRUD in `backend/src/controllers/tasks.controller.ts`
   - Frontend state in `frontend/src/context/AuthContext.tsx`
   - Task management in `frontend/src/pages/TaskBoardPage.tsx`

## Resetting Everything

If you want to start fresh:

```bash
# Delete local database (PostgreSQL must be running)
dropdb task_manager

# Recreate database and run migrations
cd backend
npm run prisma:migrate

# Restart both frontend and backend
```

## Deployment (Future)

When ready to deploy:
- Push to GitHub
- Backend: Deploy to Railway, Render, or Vercel
- Frontend: Deploy to Vercel or Netlify
- Database: Use Neon or managed PostgreSQL

See root `README.md` for more deployment details.

## Support

For issues:
1. Check the troubleshooting section above
2. Review error messages in browser console (frontend) or terminal (backend)
3. Check `backend/.env` and `frontend/.env.local` are configured correctly
4. Ensure both postgres and both dev servers are running

**Happy coding!** 🚀

