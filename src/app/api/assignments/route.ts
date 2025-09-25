import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAssignmentSchema } from '@/lib/validations';
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
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const classId = searchParams.get('classId');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (subject) where.subject = subject;
    if (published !== null && published !== undefined) {
      where.isPublished = published === 'true';
    }
    if (classId) where.classId = classId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If user is a teacher, only show their assignments
    if (session.user.role === 'TEACHER') {
      where.teacherId = session.user.id;
    } else if (session.user.role === 'STUDENT') {
      // For students, only show published assignments from their classes
      where.isPublished = true;
      where.class = {
        students: {
          some: {
            studentId: session.user.id
          }
        }
      };
    }

    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true
            }
          },
          questions: {
            select: {
              id: true,
              type: true,
              points: true
            }
          },
          _count: {
            select: {
              questions: true,
              studentProgress: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.assignment.count({ where })
    ]);

    return NextResponse.json({
      assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Assignments GET error:', error);
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
    
    // Validate request data
    const validationResult = createAssignmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verify that the class belongs to the teacher
    if (data.classId) {
      const teacherClass = await prisma.class.findFirst({
        where: {
          id: data.classId,
          teacherId: session.user.id
        }
      });

      if (!teacherClass) {
        return NextResponse.json(
          { error: 'Bạn không có quyền tạo bài tập cho lớp này' },
          { status: 403 }
        );
      }
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        teacherId: session.user.id,
        classId: data.classId
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            grade: true
          }
        },
        _count: {
          select: {
            questions: true,
            studentProgress: true
          }
        }
      }
    });

    return NextResponse.json(assignment, { status: 201 });

  } catch (error) {
    console.error('Assignments POST error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}