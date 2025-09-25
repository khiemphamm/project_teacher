import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createUserSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = createUserSchema.parse(body);
    
    // Only allow STUDENT role registration
    // Teachers are created by admin only
    if (validatedData.role !== 'STUDENT') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Chỉ được phép đăng ký tài khoản học sinh. Tài khoản giáo viên được tạo bởi quản trị viên.' 
        },
        { status: 403 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email này đã được sử dụng' 
        },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role,
        schoolId: validatedData.schoolId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Tài khoản đã được tạo thành công',
      data: user
    });
    
  } catch (error) {
    console.error('Register error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu không hợp lệ',
          errors: error
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Đã xảy ra lỗi server' 
      },
      { status: 500 }
    );
  }
}