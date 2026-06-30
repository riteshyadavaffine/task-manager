# Task Manager - Quick Start Reference

**⚡ Start from scratch in 5 minutes!**

## Prerequisites Check
```bash
node --version      # Must be 18+
npm --version       # Should work
psql --version      # PostgreSQL running?
```

## Step 1: Configure Database (2 min)
```bash
# In backend/.env, update:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_manager"
```

## Step 2: Start Backend (1 min)
```bash
cd backend
npm install
npm run prisma:migrate    # Creates tables
npm run dev               # Starts on :3001
```

**Wait for:** `Server running on http://localhost:3001`

## Step 3: Start Frontend (1 min)
```bash
# Open NEW terminal
cd frontend
npm install
npm run dev               # Starts on :5173
```

**Wait for:** `Local: http://localhost:5173/`

## Step 4: Test It (1 min)
```
Browser → http://localhost:5173/
1. Click Register
2. Enter: test@example.com / password123
3. Create a task → ✅ Done!
```

---

## Common Commands

### Backend
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile to JavaScript
npm start                # Run production build
npm run prisma:migrate   # Create migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
```

---

## Architecture at a Glance

```
[Browser] ←→ [React Frontend :5173]
                    ↓ (API calls)
           [Express Backend :3001]
                    ↓ (SQL queries)
           [PostgreSQL Database]
```

- **Frontend**: User Interface (React + Tailwind)
- **Backend**: REST API (Express + TypeScript)
- **Database**: Data Storage (PostgreSQL + Prisma)

---

## Key Features Implemented

✅ **User Auth**: Register → Login → Logout  
✅ **Task CRUD**: Create → Read → Update → Delete  
✅ **Status Filtering**: All / Active / Completed  
✅ **Security**: Passwords hashed, JWT in cookies, ownership checks  
✅ **Type Safety**: TypeScript throughout  

---

## API Endpoints (for testing)

### Auth
```bash
POST /auth/register    # {"email":"...","password":"..."}
POST /auth/login       # {"email":"...","password":"..."}
POST /auth/logout      # (requires auth)
GET  /auth/me          # (requires auth)
```

### Tasks (all require auth)
```bash
GET    /api/tasks                 # Fetch all
GET    /api/tasks?status=ACTIVE    # Filter
POST   /api/tasks                 # Create
PUT    /api/tasks/:id             # Update
DELETE /api/tasks/:id             # Delete
```

**Test with curl:**
```bash
curl -b cookies.txt http://localhost:3001/api/tasks
```

---

## File Structure (Essential Files)

```
backend/
  .env                          # DATABASE_URL & JWT_SECRET
  src/app.ts                    # Express app
  controllers/auth.controller.ts # Login/register logic
  controllers/tasks.controller.ts # Task CRUD logic
  prisma/schema.prisma          # Database models

frontend/
  src/App.tsx                   # Router
  context/AuthContext.tsx       # User state
  api/client.ts                 # API calls
  pages/TaskBoardPage.tsx       # Main app
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` | PostgreSQL not running |
| Port `:3001` in use | Change PORT in `.env` |
| Invalid DATABASE_URL | Check username/password |
| Module not found | Run `npm install` in that directory |
| Stale cookies | Delete cookies.txt, restart browser |

---

## Environment Variables

### Backend `.env` (Required)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/task_manager
JWT_SECRET=super-secret-key-change-in-production
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env.local` (Optional)
```
VITE_API_URL=http://localhost:3001
```

---

## Testing Workflow

### 1. Manual Test in Browser
```
/login → Register → /tasks → Create task → ✅ It works!
```

### 2. API Test with curl
```bash
# Get all tasks
curl -b cookies.txt http://localhost:3001/api/tasks

# Create task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test"}'
```

See `TESTING.md` for complete API testing guide.

---

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure real database (Neon, Railway)
- [ ] Deploy backend (Railway, Render)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Update CORS origin
- [ ] Enable HTTPS/SSL
- [ ] Set up error monitoring (Sentry)

---

## Documentation Links

- `README.md` - Full project overview
- `SETUP.md` - Detailed setup instructions
- `TESTING.md` - Complete API testing guide
- `IMPLEMENTATION.md` - Architecture & retrospective
- `backend/README.md` - Backend API docs
- `frontend/README.md` - Frontend docs

---

## Helpful Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Info](https://jwt.io/)

---

## Success Indicators ✅

- [x] Backend running on `:3001`
- [x] Frontend running on `:5173`
- [x] Can register user
- [x] Can create task
- [x] Tasks persist after logout/login
- [x] Can filter tasks by status
- [x] Can edit tasks
- [x] Can delete tasks
- [x] Cannot access other user's tasks

**All checked?** → 🎉 You're done!

---

**Need help?** Check the appropriate README:
- Backend issues → `backend/README.md`
- Frontend issues → `frontend/README.md`
- Setup issues → `SETUP.md`
- Testing → `TESTING.md`

