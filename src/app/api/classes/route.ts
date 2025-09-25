import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isTeacher, AUTH_ERRORS } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (subject) where.subject = subject;
    if (grade) where.grade = grade;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If user is a teacher, only show their classes
    if (session.user.role === 'TEACHER') {
      where.teacherId = session.user.id;
    } else if (session.user.role === 'STUDENT') {
      // For students, only show classes they're enrolled in
      where.students = {
        some: {
          studentId: session.user.id
        }
      };
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          school: {
            select: {
              id: true,
              name: true
            }
          },
          students: {
            select: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              students: true,
              assignments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.class.count({ where })
    ]);

    return NextResponse.json({
      classes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Classes GET error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !isTeacher(session.user)) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, grade, subject, description, schoolId } = body;

    // Validate required fields
    if (!name || !grade || !subject) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (tên lớp, khối, môn học)' },
        { status: 400 }
      );
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        subject,
        description,
        teacherId: session.user.id,
        schoolId: schoolId || null
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        school: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            students: true,
            assignments: true
          }
        }
      }
    });

    return NextResponse.json(newClass, { status: 201 });

  } catch (error) {
    console.error('Classes POST error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}