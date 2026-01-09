#!/bin/bash
BASE_URL="http://localhost:4000"

# Register/Login
echo "Logging in..."
LOGIN_RES=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}')

TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Trying register..."
  REG_RES=$(curl -s -X POST $BASE_URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com", "password":"password123"}')
  TOKEN=$(echo $REG_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "Failed to get token."
  echo "Login Res: $LOGIN_RES"
  exit 1
fi

echo "Token: $TOKEN"

# Create Task
echo "Creating Task..."
CREATE_RES=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Task", "description":"Testing backend"}')
echo $CREATE_RES

TASK_ID=$(echo $CREATE_RES | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Task ID: $TASK_ID"

if [ -z "$TASK_ID" ]; then
  echo "Failed to create task."
  exit 1
fi

# List Tasks
echo "Listing Tasks..."
curl -s -X GET "$BASE_URL/tasks" -H "Authorization: Bearer $TOKEN"
echo ""

# Update Task
echo "Updating Task..."
curl -s -X PATCH "$BASE_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Updated Task", "status":"DONE"}'
echo ""

# Toggle Task
echo "Toggling Task..."
curl -s -X PATCH "$BASE_URL/tasks/$TASK_ID/toggle" \
  -H "Authorization: Bearer $TOKEN"
echo ""

# Delete Task
echo "Deleting Task..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo "Verification Complete."
