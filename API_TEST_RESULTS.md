# MongoDB Atlas Connection Issues - Switching to Mock Data

## ⚠️ **Current Issues:**
- Atlas cluster connection timeout
- "InternalError" từ MongoDB Atlas servers
- Có thể do cluster paused hoặc network issues

## 🔧 **Temporary Solution:**
Switch to mock data để demo API functionality

## 📋 **APIs Ready for Testing:**
1. ✅ **GET /api/questions** - List questions with pagination
2. ✅ **POST /api/questions** - Create new question  
3. ✅ **GET /api/assignments** - List assignments
4. ✅ **POST /api/assignments** - Create assignment
5. ✅ **GET /api/classes** - List classes
6. ✅ **POST /api/admin/teachers** - Create teacher account

## 🚀 **Test Commands:**
```bash
# Test Questions API
curl -X GET http://localhost:3000/api/questions

# Test Assignments API  
curl -X GET http://localhost:3000/api/assignments

# Test Classes API
curl -X GET http://localhost:3000/api/classes

# Test Admin API
curl -X POST http://localhost:3000/api/admin/teachers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@teacher.com","name":"Test Teacher","password":"pass123"}'
```

## 📊 **Atlas Troubleshooting:**
1. Check if cluster is paused in Atlas dashboard
2. Verify IP whitelist includes current IP
3. Check password special characters encoding
4. Consider using Atlas connection troubleshooter