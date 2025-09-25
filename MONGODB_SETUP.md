# MongoDB Setup Guide

## 🚀 Option 1: MongoDB Atlas (Cloud - Recommended)

1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Đăng ký tài khoản miễn phí
3. Tạo cluster mới (chọn FREE tier)
4. Tạo database user và password
5. Whitelist IP address (0.0.0.0/0 for development)
6. Get connection string

### Connection String Format:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/scienceedu?retryWrites=true&w=majority
```

## 💻 Option 2: Local MongoDB (Sau khi update Command Line Tools)

1. Update Command Line Tools:
```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

2. Install MongoDB:
```bash
brew tap mongodb/brew
brew install mongodb-community@8.0
```

3. Start MongoDB service:
```bash
brew services start mongodb-community@8.0
```

4. Verify installation:
```bash
mongosh
```

## 🔧 After Database Setup

1. Update .env.local with your connection string
2. Push schema to database:
```bash
npm run db:push
```

3. Seed sample data:
```bash
npm run db:seed
```

4. Open Prisma Studio to verify:
```bash
npm run db:studio
```