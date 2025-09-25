#!/bin/bash

# 🧪 ScienceEdu API Testing Script
# This script tests all API endpoints using curl commands

echo "🚀 Starting ScienceEdu API Testing..."
echo "📍 Base URL: http://localhost:3000"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    echo -e "\n${BLUE}🧪 Testing: $description${NC}"
    echo -e "${YELLOW}$method $url${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "HTTPCODE:%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json")
    else
        response=$(curl -s -w "HTTPCODE:%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | grep -o "HTTPCODE:[0-9]*" | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTPCODE:[0-9]*$//')
    
    if [[ $http_code -ge 200 && $http_code -lt 300 ]]; then
        echo -e "${GREEN}✅ SUCCESS ($http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    elif [[ $http_code -ge 400 && $http_code -lt 500 ]]; then
        echo -e "${YELLOW}⚠️  CLIENT ERROR ($http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ ERROR ($http_code)${NC}"
        echo "$body"
    fi
    
    echo "--------------------------------"
}

# Base URL
BASE_URL="http://localhost:3000"

echo -e "\n${BLUE}🔐 AUTHENTICATION TESTS${NC}"
echo "======================================="

# Test 1: Register Teacher
test_endpoint "POST" "$BASE_URL/api/auth/register" \
'{
  "name": "Giáo viên Hóa học",
  "email": "teacher.chemistry@example.com", 
  "password": "123456aA",
  "role": "TEACHER"
}' \
"Register Teacher Account"

# Test 2: Register Student  
test_endpoint "POST" "$BASE_URL/api/auth/register" \
'{
  "name": "Học sinh Nguyễn Văn A",
  "email": "student@example.com",
  "password": "123456aA", 
  "role": "STUDENT"
}' \
"Register Student Account"

# Test 3: Get Session
test_endpoint "GET" "$BASE_URL/api/auth/session" "" \
"Get Current Session"

echo -e "\n${BLUE}🏫 CLASSES MANAGEMENT TESTS${NC}"
echo "======================================="

# Test 4: Get Classes (should require auth)
test_endpoint "GET" "$BASE_URL/api/classes?page=1&limit=5" "" \
"Get Classes List"

# Test 5: Create Class (should require auth)
test_endpoint "POST" "$BASE_URL/api/classes" \
'{
  "name": "Hóa học 10A1",
  "grade": "10", 
  "subject": "CHEMISTRY",
  "description": "Lớp học Hóa học nâng cao"
}' \
"Create New Class"

echo -e "\n${BLUE}📚 ASSIGNMENTS MANAGEMENT TESTS${NC}"
echo "======================================="

# Test 6: Get Assignments  
test_endpoint "GET" "$BASE_URL/api/assignments?page=1&limit=5" "" \
"Get Assignments List"

# Test 7: Create Assignment (should require auth)
test_endpoint "POST" "$BASE_URL/api/assignments" \
'{
  "title": "Bài tập về Cấu trúc nguyên tử",
  "description": "Bài tập trắc nghiệm về nguyên tử",
  "subject": "CHEMISTRY", 
  "dueDate": "2025-10-15T23:59:59.000Z",
  "classId": "507f1f77bcf86cd799439013"
}' \
"Create New Assignment"

echo -e "\n${BLUE}❓ QUESTIONS MANAGEMENT TESTS${NC}"
echo "======================================="

# Test 8: Get Questions
test_endpoint "GET" "$BASE_URL/api/questions?page=1&limit=5&subject=CHEMISTRY" "" \
"Get Questions List"

# Test 9: Create Multiple Choice Question (should require auth)
test_endpoint "POST" "$BASE_URL/api/questions" \
'{
  "type": "MULTIPLE_CHOICE",
  "question": "Trong nguyên tử, hạt nhân chứa:",
  "options": ["Proton và electron", "Neutron và electron", "Proton và neutron", "Chỉ có proton"],
  "correctAnswer": 2,
  "explanation": "Hạt nhân nguyên tử gồm proton và neutron",
  "points": 2,
  "subject": "CHEMISTRY",
  "topic": "Cấu trúc nguyên tử", 
  "difficulty": "EASY",
  "assignmentId": "507f1f77bcf86cd799439011"
}' \
"Create Multiple Choice Question"

# Test 10: Create Physics Calculation Question
test_endpoint "POST" "$BASE_URL/api/questions" \
'{
  "type": "CALCULATION", 
  "question": "Tính động năng của vật có m=2kg, v=10m/s",
  "correctAnswer": 100,
  "explanation": "Ek = 1/2 * m * v² = 100J",
  "points": 5,
  "subject": "PHYSICS",
  "topic": "Cơ học",
  "difficulty": "MEDIUM",
  "formula": "Ek = 1/2 * m * v²",
  "assignmentId": "507f1f77bcf86cd799439012"
}' \
"Create Physics Calculation Question"

echo -e "\n${BLUE}🔄 VALIDATION TESTS${NC}"
echo "======================================="

# Test 11: Invalid registration data
test_endpoint "POST" "$BASE_URL/api/auth/register" \
'{
  "name": "",
  "email": "invalid-email",
  "password": "123",
  "role": "INVALID_ROLE"
}' \
"Invalid Registration Data"

# Test 12: Invalid question data
test_endpoint "POST" "$BASE_URL/api/questions" \
'{
  "type": "INVALID_TYPE",
  "question": "",
  "points": -1
}' \
"Invalid Question Data"

echo -e "\n${GREEN}🎉 API Testing Complete!${NC}"
echo "======================================="
echo -e "${YELLOW}📊 Summary:${NC}"
echo "- ✅ Authentication endpoints tested"
echo "- ✅ Classes management tested" 
echo "- ✅ Assignments management tested"
echo "- ✅ Questions management tested"
echo "- ✅ Validation error handling tested"
echo ""
echo -e "${BLUE}📝 Notes:${NC}"
echo "- Some tests expect 401/403 errors (authentication required)"
echo "- Database connection errors are expected without MongoDB"
echo "- Success responses indicate API routes are properly configured"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Import Postman collection: ScienceEdu_API_Collection.postman_collection.json"
echo "2. Setup MongoDB connection for full database integration"  
echo "3. Test with actual authentication flow"