# 🧪 **API Testing Guide - ScienceEdu Platform**

## 🚀 **Quick Setup cho API Testing**

### 📋 **Prerequisites**
- ✅ Development server đang chạy (`npm run dev`)
- ✅ Port 3000 available
- ✅ Postman hoặc Thunder Client installed

## 🔗 **API Endpoints Overview**

### 🏠 **Base URL**: `http://localhost:3000`

---

## 🔐 **1. Authentication APIs**

### 📝 **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "teacher@example.com",
  "password": "123456aA",
  "role": "TEACHER"
}
```

### 🔑 **Login User** 
```http
POST /api/auth/callback/credentials
Content-Type: application/x-www-form-urlencoded

email=teacher@example.com&password=123456aA
```

---

## 🏫 **2. Classes Management APIs**

### 📚 **Get Classes List**
```http
GET /api/classes?page=1&limit=10&subject=CHEMISTRY&grade=10
Authorization: Bearer {session_token}
```

### ➕ **Create New Class**
```http
POST /api/classes
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "name": "Hóa học 10A1",
  "grade": "10",
  "subject": "CHEMISTRY",
  "description": "Lớp học Hóa học nâng cao"
}
```

---

## 📚 **3. Assignments Management APIs**

### 📋 **Get Assignments List**
```http
GET /api/assignments?page=1&limit=10&subject=BIOLOGY&published=true
Authorization: Bearer {session_token}
```

**Query Parameters:**
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số items mỗi trang (mặc định: 10)  
- `subject`: Môn học (BIOLOGY/CHEMISTRY/PHYSICS)
- `published`: Trạng thái công bố (true/false)
- `search`: Tìm kiếm theo title/description
- `classId`: Lọc theo lớp học

### ➕ **Create New Assignment**
```http
POST /api/assignments
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "title": "Bài tập về Tế bào",
  "description": "Bài tập trắc nghiệm và tự luận về cấu trúc tế bào",
  "subject": "BIOLOGY",
  "dueDate": "2025-10-15T23:59:59.000Z",
  "classId": "60a7c8b8d1b4c8d0e8f3a2b4"
}
```

### 📖 **Get Assignment Details**
```http
GET /api/assignments/{assignmentId}
Authorization: Bearer {session_token}
```

### ✏️ **Update Assignment**
```http
PUT /api/assignments/{assignmentId}
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "title": "Bài tập về Tế bào - Updated",
  "description": "Mô tả đã cập nhật"
}
```

### 🚀 **Publish/Unpublish Assignment**
```http
PATCH /api/assignments/{assignmentId}/publish
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "isPublished": true
}
```

### 🗑️ **Delete Assignment**
```http
DELETE /api/assignments/{assignmentId}
Authorization: Bearer {session_token}
```

---

## ❓ **4. Questions Management APIs**

### 📋 **Get Questions List**
```http
GET /api/questions?page=1&limit=10&subject=PHYSICS&type=MULTIPLE_CHOICE&difficulty=MEDIUM
Authorization: Bearer {session_token}
```

**Query Parameters:**
- `page`: Trang hiện tại
- `limit`: Số items mỗi trang
- `subject`: Môn học (BIOLOGY/CHEMISTRY/PHYSICS)
- `difficulty`: Độ khó (EASY/MEDIUM/HARD)
- `type`: Loại câu hỏi (MULTIPLE_CHOICE/ESSAY/CALCULATION/etc.)
- `search`: Tìm kiếm theo nội dung
- `assignmentId`: Lọc theo bài tập

### ➕ **Create New Question**

#### **Multiple Choice Question**
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "type": "MULTIPLE_CHOICE",
  "question": "Trong nguyên tử, hạt nhân chứa:",
  "options": ["Proton và electron", "Neutron và electron", "Proton và neutron", "Chỉ có proton"],
  "correctAnswer": 2,
  "explanation": "Hạt nhân nguyên tử gồm proton mang điện tích dương và neutron trung hòa điện",
  "points": 2,
  "subject": "CHEMISTRY",
  "topic": "Cấu trúc nguyên tử",
  "difficulty": "EASY",
  "assignmentId": "60a7c8b8d1b4c8d0e8f3a2b5"
}
```

#### **Physics Calculation Question**
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "type": "CALCULATION",
  "question": "Một vật có khối lượng 2kg chuyển động với vận tốc 10m/s. Tính động năng của vật.",
  "correctAnswer": 100,
  "explanation": "Động năng Ek = 1/2 * m * v² = 1/2 * 2 * 10² = 100J",
  "points": 5,
  "subject": "PHYSICS", 
  "topic": "Cơ học",
  "difficulty": "MEDIUM",
  "formula": "Ek = 1/2 * m * v²",
  "assignmentId": "60a7c8b8d1b4c8d0e8f3a2b6"
}
```

#### **Chemistry Equation Question**
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "type": "EQUATION",
  "question": "Cân bằng phương trình phản ứng: Na + Cl₂ → NaCl",
  "correctAnswer": "2Na + Cl₂ → 2NaCl",
  "explanation": "Cân bằng theo định luật bảo toàn khối lượng",
  "points": 3,
  "subject": "CHEMISTRY",
  "topic": "Phản ứng hóa học", 
  "difficulty": "MEDIUM",
  "chemicalEquation": "2Na + Cl₂ → 2NaCl",
  "assignmentId": "60a7c8b8d1b4c8d0e8f3a2b7"
}
```

#### **Biology Diagram Question**
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "type": "DIAGRAM",
  "question": "Nhận dạng các bộ phận của tế bào thực vật trong hình:",
  "correctAnswer": {
    "parts": ["Thành tế bào", "Màng tế bào", "Nhân", "Bào quan", "Không bào"]
  },
  "explanation": "Tế bào thực vật có thành tế bào cứng bao ngoài màng tế bào",
  "points": 4,
  "subject": "BIOLOGY",
  "topic": "Tế bào học",
  "difficulty": "HARD", 
  "diagramData": {
    "imageUrl": "/images/plant-cell.jpg",
    "labels": ["cell_wall", "cell_membrane", "nucleus", "organelles", "vacuole"]
  },
  "assignmentId": "60a7c8b8d1b4c8d0e8f3a2b8"
}
```

### 📖 **Get Question Details**
```http
GET /api/questions/{questionId}
Authorization: Bearer {session_token}
```

### ✏️ **Update Question**
```http
PUT /api/questions/{questionId}
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "question": "Updated question content",
  "points": 3,
  "difficulty": "HARD"
}
```

### 🗑️ **Delete Question**
```http
DELETE /api/questions/{questionId}
Authorization: Bearer {session_token}
```

---

## 📊 **Expected Response Format**

### ✅ **Success Response**
```json
{
  "data": {
    "id": "60a7c8b8d1b4c8d0e8f3a2b4",
    "title": "Bài tập về Tế bào",
    "createdAt": "2025-09-24T10:00:00.000Z"
  }
}
```

### 📋 **List Response với Pagination**
```json
{
  "assignments": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### ❌ **Error Response**
```json
{
  "error": "Dữ liệu không hợp lệ",
  "details": [
    {
      "field": "title",
      "message": "Tiêu đề không được để trống"
    }
  ]
}
```

---

## 🔧 **Testing Tips**

### 🚨 **Common Status Codes**
- `200`: Success
- `201`: Created successfully  
- `400`: Bad request (validation error)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (no permission)
- `404`: Not found
- `500`: Internal server error

### 🔐 **Authentication Notes**
- Một số endpoints yêu cầu authentication
- Role-based access: TEACHER có thể CRUD, STUDENT chỉ đọc
- Session cookies được sử dụng cho authentication

### 🧪 **Testing Strategy**
1. **Start với Authentication**: Test register/login
2. **Test CRUD flow**: Create → Read → Update → Delete
3. **Test Permissions**: Teacher vs Student access
4. **Test Validation**: Gửi invalid data
5. **Test Edge Cases**: Empty lists, not found cases

### 📝 **Mock Data IDs** 
Nếu cần test với existing data, dùng các ID mẫu:
- Assignment ID: `507f1f77bcf86cd799439011`
- Question ID: `507f1f77bcf86cd799439012` 
- Class ID: `507f1f77bcf86cd799439013`

---

## 🎯 **Ready to Test!**

**Server Status**: ✅ Running on `http://localhost:3000`
**API Status**: 🟢 Ready for testing
**Documentation**: 📚 Complete

Start testing với Postman hoặc curl commands! 🚀