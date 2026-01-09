#!/bin/bash
# Test backend delete specifically
BASE_URL="http://localhost:4000"

echo "Logging in..."
LOGIN_RES=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}')
TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Creating Task to Delete..."
CREATE_RES=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"To Delete", "description":"Will be deleted"}')
TASK_ID=$(echo $CREATE_RES | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Task ID: $TASK_ID"

echo "Deleting Task..."
DELETE_RES=$(curl -s -v -X DELETE "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $DELETE_RES"
