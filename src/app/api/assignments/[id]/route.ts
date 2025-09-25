import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateAssignmentSchema } from '@/lib/validations';
import { isTeacher, AUTH_ERRORS } from '@/lib/auth-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
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
            grade: true,
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
            }
          }
        },
        questions: {
          select: {
            id: true,
            type: true,
            question: true,
            points: true,
            topic: true,
            difficulty: true
          },
          orderBy: { createdAt: 'asc' }
        },
        studentProgress: {
          select: {
            id: true,
            status: true,
            totalPoints: true,
            earnedPoints: true,
            percentage: true,
            startedAt: true,
            submittedAt: true,
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
            questions: true,
            studentProgress: true
          }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài tập' },
        { status: 404 }
      );
    }

    // Check if user has permission to view this assignment
    if (session.user.role === 'TEACHER' && 
        assignment.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    // For students, check if they're in the class and assignment is published
    if (session.user.role === 'STUDENT') {
      if (!assignment.isPublished) {
        return NextResponse.json(
          { error: 'Bài tập chưa được công bố' },
          { status: 403 }
        );
      }

      const isStudentInClass = assignment.class?.students.some(
        (classStudent: { student: { id: string } }) => classStudent.student.id === session.user.id
      );

      if (!isStudentInClass) {
        return NextResponse.json(
          { error: AUTH_ERRORS.UNAUTHORIZED },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(assignment);

  } catch (error) {
    console.error('Assignment GET error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !isTeacher(session.user)) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    // Check if assignment exists and user owns it
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
      select: {
        teacherId: true
      }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài tập' },
        { status: 404 }
      );
    }

    if (existingAssignment.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validationResult = updateAssignmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update assignment
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.subject && { subject: data.subject }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
        ...(data.classId && { classId: data.classId })
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

    return NextResponse.json(assignment);

  } catch (error) {
    console.error('Assignment PUT error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !isTeacher(session.user)) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    // Check if assignment exists and user owns it
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
      select: {
        teacherId: true,
        _count: {
          select: {
            studentProgress: true
          }
        }
      }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài tập' },
        { status: 404 }
      );
    }

    if (existingAssignment.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    // Check if there are any student submissions
    if (existingAssignment._count.studentProgress > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa bài tập đã có học sinh làm' },
        { status: 400 }
      );
    }

    // Delete assignment (this will also delete related questions and other data due to cascade)
    await prisma.assignment.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Xóa bài tập thành công' });

  } catch (error) {
    console.error('Assignment DELETE error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}