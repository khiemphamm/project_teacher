import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isTeacher, AUTH_ERRORS } from '@/lib/auth-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
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
      include: {
        _count: {
          select: {
            questions: true
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

    const body = await request.json();
    const { isPublished } = body;

    // Validate that assignment has questions before publishing
    if (isPublished && existingAssignment._count.questions === 0) {
      return NextResponse.json(
        { error: 'Không thể công bố bài tập chưa có câu hỏi' },
        { status: 400 }
      );
    }

    // Calculate total points when publishing
    let totalPoints = existingAssignment.totalPoints;
    if (isPublished) {
      const questionsPoints = await prisma.question.aggregate({
        where: { assignmentId: id },
        _sum: {
          points: true
        }
      });
      totalPoints = questionsPoints._sum.points || 0;
    }

    // Update assignment
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        isPublished,
        totalPoints
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

    return NextResponse.json({
      assignment,
      message: isPublished ? 'Công bố bài tập thành công' : 'Hủy công bố bài tập thành công'
    });

  } catch (error) {
    console.error('Assignment publish error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}