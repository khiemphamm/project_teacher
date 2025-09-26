import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subjects = await prisma.subjectInfo.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Subjects GET error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, displayName, icon, color, topics, description } = body;

    // Validate required fields
    if (!name || !displayName || !icon || !color) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (name, displayName, icon, color)' },
        { status: 400 }
      );
    }

    // Create subject
    const newSubject = await prisma.subjectInfo.create({
      data: {
        name,
        displayName,
        icon,
        color,
        topics: topics || [],
        description
      }
    });

    return NextResponse.json(newSubject, { status: 201 });

  } catch (error) {
    console.error('Subjects POST error:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'Môn học này đã tồn tại' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}