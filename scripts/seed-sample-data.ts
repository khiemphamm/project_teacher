import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample questions and assignments...');

  // First, let's create a sample teacher user if not exists
  const teacherEmail = 'teacher@example.com';
  let teacher = await prisma.user.findUnique({
    where: { email: teacherEmail }
  });

  if (!teacher) {
    teacher = await prisma.user.create({
      data: {
        email: teacherEmail,
        name: 'Giáo viên Mẫu',
        role: 'TEACHER',
        password: 'hashedpassword' // In real app, this should be properly hashed
      }
    });
    console.log('✅ Created sample teacher');
  }

  // Create a sample school
  let school = await prisma.school.findFirst();
  if (!school) {
    school = await prisma.school.create({
      data: {
        name: 'Trường THPT ABC',
        address: 'Hà Nội, Việt Nam'
      }
    });
    console.log('✅ Created sample school');
  }

  // Create a sample class for Biology
  let biologyClass = await prisma.class.findFirst({
    where: {
      subject: 'BIOLOGY',
      teacherId: teacher.id
    }
  });

  if (!biologyClass) {
    biologyClass = await prisma.class.create({
      data: {
        name: 'Sinh học 12A1',
        grade: '12',
        subject: 'BIOLOGY',
        description: 'Lớp Sinh học khối 12',
        teacherId: teacher.id,
        schoolId: school.id
      }
    });
    console.log('✅ Created sample biology class');
  }

  // Create a sample assignment
  let assignment = await prisma.assignment.findFirst({
    where: {
      subject: 'BIOLOGY',
      teacherId: teacher.id
    }
  });

  if (!assignment) {
    assignment = await prisma.assignment.create({
      data: {
        title: 'Kiểm tra Tế bào và Di truyền',
        description: 'Bài kiểm tra về cấu trúc tế bào và các quy luật di truyền cơ bản',
        subject: 'BIOLOGY',
        totalPoints: 10,
        isPublished: true,
        teacherId: teacher.id,
        classId: biologyClass.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
    console.log('✅ Created sample assignment');
  }

  // Sample Biology questions
  const sampleQuestions = [
    {
      type: 'MULTIPLE_CHOICE' as const,
      question: 'Thành phần chính của màng tế bào là gì?',
      options: ['Protein', 'Lipid', 'Carbohydrate', 'DNA'],
      correctAnswer: JSON.stringify('Lipid'), // Store as JSON
      explanation: 'Màng tế bào chủ yếu được tạo thành từ lớp lipid kép (phospholipid bilayer)',
      points: 2,
      subject: 'BIOLOGY' as const,
      topic: 'Tế bào',
      difficulty: 'EASY' as const
    },
    {
      type: 'MULTIPLE_CHOICE' as const,
      question: 'Quá trình nào sau đây xảy ra trong ti thể?',
      options: ['Quang hợp', 'Hô hấp tế bào', 'Phân chia tế bào', 'Tổng hợp protein'],
      correctAnswer: JSON.stringify('Hô hấp tế bào'), // Store as JSON
      explanation: 'Ti thể là nơi xảy ra quá trình hô hấp tế bào để tạo ra ATP',
      points: 2,
      subject: 'BIOLOGY' as const,
      topic: 'Tế bào',
      difficulty: 'MEDIUM' as const
    },
    {
      type: 'ESSAY' as const,
      question: 'Giải thích quá trình quang hợp ở thực vật, bao gồm các giai đoạn và sản phẩm chính.',
      options: [], // Empty for essay questions
      correctAnswer: null, // No fixed correct answer for essay
      explanation: 'Quang hợp gồm 2 giai đoạn: phản ứng sáng (tạo ATP và NADPH) và phản ứng tối (chu trình Calvin tạo glucose)',
      points: 3,
      subject: 'BIOLOGY' as const,
      topic: 'Quang hợp',
      difficulty: 'MEDIUM' as const
    },
    {
      type: 'MULTIPLE_CHOICE' as const,
      question: 'Định luật phân li độc lập của Mendel áp dụng cho:',
      options: ['Các gen trên cùng một nhiễm sắc thể', 'Các gen trên các nhiễm sắc thể khác nhau', 'Chỉ các gen trội', 'Chỉ các gen lặn'],
      correctAnswer: JSON.stringify('Các gen trên các nhiễm sắc thể khác nhau'), // Store as JSON
      explanation: 'Định luật phân li độc lập chỉ áp dụng cho các gen nằm trên các nhiễm sắc thể khác nhau hoặc cách xa nhau trên cùng nhiễm sắc thể',
      points: 2,
      subject: 'BIOLOGY' as const,
      topic: 'Di truyền học',
      difficulty: 'MEDIUM' as const
    },
    {
      type: 'TRUE_FALSE' as const,
      question: 'DNA chứa thông tin di truyền ở tất cả các sinh vật.',
      options: ['Đúng', 'Sai'],
      correctAnswer: JSON.stringify(true), // Store as JSON
      explanation: 'DNA (hoặc RNA ở một số virus) là vật chất di truyền của tất cả sinh vật',
      points: 1,
      subject: 'BIOLOGY' as const,
      topic: 'Di truyền học',
      difficulty: 'EASY' as const
    }
  ];

  // Create questions
  for (const questionData of sampleQuestions) {
    const existingQuestion = await prisma.question.findFirst({
      where: {
        question: questionData.question,
        assignmentId: assignment.id
      }
    });

    if (!existingQuestion) {
      await prisma.question.create({
        data: {
          ...questionData,
          assignmentId: assignment.id
        }
      });
    }
  }

  console.log(`✅ Created ${sampleQuestions.length} sample biology questions`);

  // Update assignment total points
  const totalPoints = sampleQuestions.reduce((sum, q) => sum + q.points, 0);
  await prisma.assignment.update({
    where: { id: assignment.id },
    data: { totalPoints }
  });

  console.log('🎉 Sample data seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Teacher: ${teacher.name} (${teacher.email})`);
  console.log(`   - Class: ${biologyClass.name}`);
  console.log(`   - Assignment: ${assignment.title}`);
  console.log(`   - Questions: ${sampleQuestions.length} (${totalPoints} points)`);
}

main()
  .catch((e) => {
    console.error('❌ Sample data seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });