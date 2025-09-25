import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createQuestionSchema } from '@/lib/validations';
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
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const assignmentId = searchParams.get('assignmentId');

    // Build where clause using proper Prisma types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;
    if (assignmentId) where.assignmentId = assignmentId;

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If user is a teacher, only show their questions
    if (session.user.role === 'TEACHER') {
      where.assignment = {
        teacherId: session.user.id
      };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              teacher: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              studentAnswers: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.question.count({ where })
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Questions GET error:', error);
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
    const validationResult = createQuestionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create question
    const question = await prisma.question.create({
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
        diagramData: data.diagramData,
        assignmentId: data.assignmentId
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

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error('Questions POST error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}