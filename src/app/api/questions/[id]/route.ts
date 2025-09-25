import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateQuestionSchema } from '@/lib/validations';
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

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        studentAnswers: {
          select: {
            id: true,
            answer: true,
            isCorrect: true,
            pointsEarned: true,
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
            studentAnswers: true
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    // Check if user has permission to view this question
    if (session.user.role === 'TEACHER' && 
        question.assignment.teacher.id !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    return NextResponse.json(question);

  } catch (error) {
    console.error('Question GET error:', error);
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

    // Check if question exists and user owns it
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        assignment: {
          select: {
            teacherId: true
          }
        }
      }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    if (existingQuestion.assignment.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validationResult = updateQuestionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update question
    const question = await prisma.question.update({
      where: { id },
      data: {
        type: data.type,
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        points: data.points,
        subject: data.subject,
        topic: data.topic,
        difficulty: data.difficulty,
        formula: data.formula,
        chemicalEquation: data.chemicalEquation,
        diagramData: data.diagramData
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(question);

  } catch (error) {
    console.error('Question PUT error:', error);
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

    // Check if question exists and user owns it
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        assignment: {
          select: {
            teacherId: true
          }
        }
      }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    if (existingQuestion.assignment.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.UNAUTHORIZED },
        { status: 403 }
      );
    }

    // Delete question (this will also delete related StudentAnswer records due to cascade)
    await prisma.question.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Xóa câu hỏi thành công' });

  } catch (error) {
    console.error('Question DELETE error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}