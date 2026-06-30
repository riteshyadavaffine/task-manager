# CRUD Task Manager - Full-Stack Application

A production-ready full-stack task management application demonstrating complete integration of frontend, backend, and database.

## 🎯 Overview

This project implements a full-stack task manager with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Node.js 20
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT in httpOnly cookies


## Live URL:
https://task-manager-omega-jade-46.vercel.app/
backend(https://tranquil-dedication-production-7635.up.railway.app)

## 📁 Project Structure
```
task-manager/
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth, error handling
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic (auth)
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # JWT, password utilities
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                  # Database & JWT config
│   └── README.md             # Backend docs
│
└── frontend/         # React SPA
    ├── src/
    │   ├── api/              # Axios client + endpoints
    │   ├── components/       # Reusable UI components
    │   ├── context/          # Auth state (Context API)
    │   ├── pages/            # Page components
    │   ├── types/            # TypeScript types
    │   ├── App.tsx           # Router
    │   ├── main.tsx          # Entry point
    │   └── index.css         # Tailwind + globals
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── package.json
    ├── tsconfig.json
    └── README.md             # Frontend docs
```

## ✨ Features

### Authentication
- User registration with email/password
- JWT-based login with httpOnly cookies
- Secure session handling
- Logout with cookie clearance

### Task Management
- Create tasks with title and description
- Edit existing tasks
- Mark tasks as completed/active
- Delete tasks
- Filter tasks by status (All/Active/Completed)
- Client-side filtering

### Security
- Password hashing with bcryptjs
- JWT token verification on protected routes
- Ownership verification for task operations (user can only modify their own tasks)
- CORS configured for frontend origin
- httpOnly cookies prevent XSS attacks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (with connection string)
- npm or yarn

### Database Setup

1. Ensure PostgreSQL is running
2. In `backend/.env`, set DATABASE_URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
   ```
3. Run migrations:
   ```bash
   cd backend
   npm install
   npm run prisma:migrate
   ```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔌 API Endpoints

### Authentication
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Tasks
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/tasks?status=ACTIVE` | Get all tasks (filterable) | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

## 📊 Database Schema

### User
```sql
id (UUID, PK)
email (String, unique)
password (String, hashed)
createdAt (DateTime)
updatedAt (DateTime)
```

### Task
```sql
id (UUID, PK)
userId (UUID, FK → User)
title (String, required)
description (String, optional)
status (Enum: ACTIVE | COMPLETED)
createdAt (DateTime)
updatedAt (DateTime)
```

## 🔐 Authentication Flow

1. **Register**: User submits email/password → Backend hashes password, creates user
2. **Login**: User submits credentials → Backend verifies, generates JWT token → Token stored in httpOnly cookie
3. **Protected Requests**: Frontend sends request → Middleware verifies JWT → User attached to request → Response sent
4. **Logout**: Frontend calls logout endpoint → Backend clears cookie → User logged out

## 🧪 Testing API Endpoints

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
  -d '{"title":"My Task","description":"Task details"}'
```

### Get All Tasks
```bash
curl -X GET http://localhost:3001/api/tasks \
  -b cookies.txt
```

### Get Completed Tasks Only
```bash
curl -X GET "http://localhost:3001/api/tasks?status=COMPLETED" \
  -b cookies.txt
```

### Update Task
```bash
curl -X PUT http://localhost:3001/api/tasks/{taskId} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Updated Title","status":"COMPLETED"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:3001/api/tasks/{taskId} \
  -b cookies.txt
```

## 🏗️ Build Sequence

### Backend Build (Phase 1-2)
✅ Database schema with Prisma  
✅ Auth service (password hashing, JWT utilities)  
✅ Auth middleware (JWT verification)  
✅ Auth controllers & routes (register, login, logout, me)  
✅ Task controllers & routes (CRUD with ownership checks)  
✅ Error handling middleware  
✅ API tested with curl  

### Frontend Build (Phase 3-4)
✅ API client with axios  
✅ Auth context & hooks  
✅ Protected routes  
✅ Login/Register pages  
✅ Task board with task list  
✅ Task form (create/edit)  
✅ Task filtering  
✅ UI components with Tailwind CSS  

## 🚨 Key Security Considerations

1. **Ownership Verification**: Every task operation checks that `req.user.id === task.userId`
2. **Password Security**: Passwords hashed with bcryptjs (10 salt rounds)
3. **httpOnly Cookies**: JWT not accessible via JavaScript (prevents XSS)
4. **CORS**: Limited to frontend origin only
5. **Error Handling**: Generic error messages (don't leak user info)

## 📝 Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager
JWT_SECRET=your-secret-key-min-32-chars-for-production
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (optional `.env.local`)
```
VITE_API_URL=http://localhost:3001
```

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack JavaScript/TypeScript development
- Database design and Prisma ORM
- RESTful API design
- JWT-based authentication
- React component patterns and hooks
- Context API for state management
- Type safety with TypeScript
- Error handling and validation
- Security best practices

## 🎓 Retrospective Questions

1. **Did you test each API endpoint before building the frontend?**
   - Testing with curl ensures the API works before frontend integration

2. **Did any AI-generated code fail the ownership check?**
   - Critical: Always verify `req.user.id === resource.userId` before modifications

3. **How long did the database → backend → frontend pipeline take?**
   - Database: ~5 min | Backend: ~20 min | Frontend: ~25 min

## 🚢 Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure DATABASE_URL to production database
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags

### Recommended Hosting
- **Database**: Neon, Railway, or managed PostgreSQL
- **Backend**: Railway, Render, Heroku, or Vercel Functions
- **Frontend**: Vercel, Netlify, or GitHub Pages

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Zod Validation](https://zod.dev/)

## 📄 License

MIT

