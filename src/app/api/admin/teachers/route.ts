import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.name || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email, tên và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    
    const mockTeacher = {
      id: `teacher_${Date.now()}`,
      email: body.email,
      name: body.name,
      role: 'TEACHER',
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Tài khoản giáo viên đã được tạo thành công',
      data: mockTeacher
    });
    
  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const mockTeachers = [
      {
        id: 'teacher_1',
        email: 'teacher1@example.com',
        name: 'Nguyễn Văn A',
        role: 'TEACHER',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockTeachers,
      pagination: { page: 1, limit: 10, total: 1, pages: 1 }
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
