# CRUD Task Manager - API Testing Guide

Complete guide to test all API endpoints using curl commands. These tests verify the backend is working correctly before integrating with the frontend.

## Testing Workflow

### 1. Test Server Health
Check if backend is running:
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{"message":"Server is running"}
```

---

## Authentication Endpoints

### 2. Register New User

**Create test user:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "test@example.com"
  },
  "message": "User registered successfully"
}
```

✅ Cookie saved to `cookies.txt`

---

### 3. Login User

**Test after registration:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "test@example.com"
  },
  "message": "Login successful"
}
```

---

### 4. Get Current User (Protected)

**Verify authentication:**
```bash
curl -X GET http://localhost:3001/auth/me \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "test@example.com"
  }
}
```

---

### 5. Test Without Authentication

**Should fail without cookie:**
```bash
curl -X GET http://localhost:3001/auth/me
```

**Expected Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized - no token"
}
```

---

## Task Endpoints (All Protected)

### 6. Create Task

**Basic task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Task created successfully"
}
```

**Save task ID for later tests:**
```bash
TASK_ID="task-uuid-from-response"
```

---

### 7. Create Task Without Title (Should Fail)

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"description":"No title provided"}'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Title is required"
}
```

---

### 8. Get All Tasks

**Fetch all user tasks:**
```bash
curl -X GET http://localhost:3001/api/tasks \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid",
      "userId": "user-uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 9. Get Tasks Filtered by Status

**Get only ACTIVE tasks:**
```bash
curl -X GET "http://localhost:3001/api/tasks?status=ACTIVE" \
  -b cookies.txt
```

**Get only COMPLETED tasks:**
```bash
curl -X GET "http://localhost:3001/api/tasks?status=COMPLETED" \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid",
      "status": "ACTIVE",
      ...
    }
  ]
}
```

---

### 10. Get Single Task by ID

```bash
curl -X GET http://localhost:3001/api/tasks/$TASK_ID \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 11. Update Task

**Change title and status:**
```bash
curl -X PUT http://localhost:3001/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Updated: Buy groceries","status":"COMPLETED"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Updated: Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "COMPLETED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  },
  "message": "Task updated successfully"
}
```

---

### 12. Test Ownership Verification (Security)

**Create first user's task:**
```bash
# Save cookies for user1
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -c cookies_user1.txt \
  -d '{"email":"user1@example.com","password":"pass123"}'

# Get task ID
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies_user1.txt \
  -d '{"title":"User1 Task"}' > task_response.json
```

**Register different user:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -c cookies_user2.txt \
  -d '{"email":"user2@example.com","password":"pass123"}'
```

**User2 tries to update User1's task (should fail):**
```bash
curl -X PUT http://localhost:3001/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -b cookies_user2.txt \
  -d '{"title":"Hacked!"}'
```

**Expected Response (403):**
```json
{
  "success": false,
  "error": "Forbidden - you do not own this task"
}
```

✅ **SECURITY VERIFIED**: Cross-user access prevented!

---

### 13. Delete Task

**Delete owned task:**
```bash
curl -X DELETE http://localhost:3001/api/tasks/$TASK_ID \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 14. Delete Non-existent Task (Should Fail)

```bash
curl -X DELETE http://localhost:3001/api/tasks/nonexistent-id \
  -b cookies.txt
```

**Expected Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 15. Logout

**Clear session:**
```bash
curl -X POST http://localhost:3001/auth/logout \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Automated Test Script

**Save as `test-api.sh` in project root:**

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3001"
COOKIES="cookies.txt"

echo "🧪 Task Manager API Testing"
echo "=============================="

# 1. Health Check
echo -e "\n${GREEN}1. Health Check${NC}"
curl -s $BASE_URL/health | jq .

# 2. Register
echo -e "\n${GREEN}2. Register User${NC}"
REGISTER_RESPONSE=$(curl -s -c $COOKIES -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
echo $REGISTER_RESPONSE | jq .

# 3. Create Task
echo -e "\n${GREEN}3. Create Task${NC}"
TASK_RESPONSE=$(curl -s -b $COOKIES -X POST $BASE_URL/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API"}')
echo $TASK_RESPONSE | jq .
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.data.id')

# 4. Get All Tasks
echo -e "\n${GREEN}4. Get All Tasks${NC}"
curl -s -b $COOKIES $BASE_URL/api/tasks | jq .

# 5. Update Task
echo -e "\n${GREEN}5. Update Task${NC}"
curl -s -b $COOKIES -X PUT $BASE_URL/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","status":"COMPLETED"}' | jq .

# 6. Delete Task
echo -e "\n${GREEN}6. Delete Task${NC}"
curl -s -b $COOKIES -X DELETE $BASE_URL/api/tasks/$TASK_ID | jq .

# 7. Logout
echo -e "\n${GREEN}7. Logout${NC}"
curl -s -b $COOKIES -X POST $BASE_URL/auth/logout | jq .

echo -e "\n${GREEN}✅ All tests completed!${NC}"

# Cleanup
rm -f $COOKIES
```

**Run the script:**
```bash
bash test-api.sh
```

---

## Test Checklist

- [ ] Health check passes
- [ ] User registration successful
- [ ] User can login
- [ ] Can fetch current user (/auth/me)
- [ ] Cannot access protected routes without auth
- [ ] Can create task with title
- [ ] Cannot create task without title
- [ ] Can get all tasks
- [ ] Can filter tasks by status
- [ ] Can get single task by ID
- [ ] Can update task (title, description, status)
- [ ] Can delete task
- [ ] Ownership verification works (User2 cannot access User1's tasks)
- [ ] Cannot access non-existent task (404)
- [ ] Logout clears session

✅ **All tests passed? Backend is production-ready!**

---

## Troubleshooting Tests

### "Connection refused"
- Backend not running: `cd backend && npm run dev`

### "Unauthorized" on protected routes
- Cookie not saved: Add `-c cookies.txt` to register/login
- Cookie expired: Re-login with a new cookie

### "CORS error"
- Backend CORS not configured for your origin
- Check `backend/.env` FRONTEND_URL

### JSON parsing errors
- Missing `jq` tool: Install from https://stedolan.io/jq/
- Or remove `| jq .` to see raw responses

## Performance Testing

### Load test tasks endpoint:
```bash
for i in {1..100}; do
  curl -s -b $COOKIES http://localhost:3001/api/tasks > /dev/null
  echo "Request $i completed"
done
```

### Monitor backend performance:
```bash
# In backend terminal, add timing logs
# Watch for slow queries in Prisma
```

---

## Next Steps

After all tests pass:
1. Start frontend: `cd frontend && npm run dev`
2. Test complete user flow in browser
3. Review code in `backend/src` and `frontend/src`
4. Deploy to production!

