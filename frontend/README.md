# Task Manager Frontend

Full-stack task manager frontend built with React 18, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6

## Features

✅ User authentication (register/login/logout)  
✅ Task CRUD operations (create, read, update, delete)  
✅ Task status filtering (all/active/completed)  
✅ Responsive design with Tailwind CSS  
✅ Protected routes  
✅ Context API for state management  
✅ Error handling and loading states  

## Project Structure

```
src/
├── api/              # API client setup with axios
├── components/       # Reusable components
│   ├── AuthForm.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── TaskCard.tsx
│   ├── TaskFilter.tsx
│   └── TaskForm.tsx
├── context/          # React Context (Auth state)
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── TaskBoardPage.tsx
├── types/            # TypeScript types
├── App.tsx           # Router configuration
├── main.tsx          # React entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on http://localhost:3001

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Authentication Flow

1. User navigates to `/login` or `/register`
2. Credentials submitted to backend via axios
3. JWT token stored in httpOnly cookie by backend
4. AuthContext updates with user data
5. ProtectedRoute checks authentication and redirects if needed
6. API client automatically includes credentials in all requests

## Task Management

### Create Task
- Click "New Task" button
- Fill in title (required) and description (optional)
- Submit form

### View Tasks
- All tasks are displayed on TaskBoard page
- Tasks filtered by status (All/Active/Completed)

### Update Task
- Click "Edit" button on task card
- Update title and/or description
- Submit changes

### Complete/Reopen Task
- Click "Complete" button to mark done
- Click "Reopen" button to mark active again

### Delete Task
- Click "Delete" button
- Confirm deletion

## Key Components

### AuthForm
Handles user registration and login with validation and error handling.

### TaskCard
Displays individual task with status badge and action buttons.

### TaskForm
Reusable form for creating and editing tasks.

### TaskFilter
Filter bar to view tasks by status.

### ProtectedRoute
Guards routes requiring authentication.

### Header
Navigation bar with user email and logout button.

## API Integration

### API Endpoints Called
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /api/tasks` - Fetch all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

Create a `.env.local` file (optional):

```
VITE_API_URL=http://localhost:3001
```

If not set, defaults to `http://localhost:3001`

## Notes

- All API requests include credentials (cookies)
- JWT token in httpOnly cookie is automatically sent
- Frontend redirects unauthenticated users to login
- Error messages displayed to user on failed operations
- Tasks are client-side filtered by status

