import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo school
  const school = await prisma.school.create({
    data: {
      name: 'Trường THPT ScienceEdu Demo',
      address: '123 Đường Khoa Học, Quận 1, TP.HCM',
      phone: '028-1234-5678',
      email: 'info@scienceedu-demo.edu.vn'
    }
  });

  console.log('✅ Created demo school');

  // Create demo teacher
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@scienceedu.demo',
      name: 'Cô Nguyễn Thị Khoa Học',
      password: teacherPassword,
      role: 'TEACHER',
      schoolId: school.id
    }
  });

  console.log('✅ Created demo teacher');

  // Create demo students
  const studentPassword = await bcrypt.hash('student123', 12);
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student1@scienceedu.demo',
        name: 'Em Trần Văn Sinh Học',
        password: studentPassword,
        role: 'STUDENT',
        schoolId: school.id
      }
    }),
    prisma.user.create({
      data: {
        email: 'student2@scienceedu.demo',
        name: 'Em Lê Thị Hóa Học',
        password: studentPassword,
        role: 'STUDENT',
        schoolId: school.id
      }
    }),
    prisma.user.create({
      data: {
        email: 'student3@scienceedu.demo',
        name: 'Em Phạm Văn Vật Lý',
        password: studentPassword,
        role: 'STUDENT',
        schoolId: school.id
      }
    })
  ]);

  console.log('✅ Created demo students');

  // Create demo classes
  const biologyClass = await prisma.class.create({
    data: {
      name: 'Sinh học 12A1',
      grade: '12',
      subject: 'BIOLOGY',
      description: 'Lớp Sinh học nâng cao',
      teacherId: teacher.id,
      schoolId: school.id
    }
  });

  const chemistryClass = await prisma.class.create({
    data: {
      name: 'Hóa học 12A2',
      grade: '12',
      subject: 'CHEMISTRY',
      description: 'Lớp Hóa học nâng cao',
      teacherId: teacher.id,
      schoolId: school.id
    }
  });

  const physicsClass = await prisma.class.create({
    data: {
      name: 'Vật lý 12A3',
      grade: '12',
      subject: 'PHYSICS',
      description: 'Lớp Vật lý nâng cao',
      teacherId: teacher.id,
      schoolId: school.id
    }
  });

  console.log('✅ Created demo classes');

  // Add students to classes
  await Promise.all([
    // Add all students to biology class
    ...students.map(student => 
      prisma.classStudent.create({
        data: {
          classId: biologyClass.id,
          studentId: student.id
        }
      })
    ),
    // Add students 1,2 to chemistry class
    ...students.slice(0, 2).map(student => 
      prisma.classStudent.create({
        data: {
          classId: chemistryClass.id,
          studentId: student.id
        }
      })
    ),
    // Add students 1,3 to physics class
    [students[0], students[2]].map(student => 
      prisma.classStudent.create({
        data: {
          classId: physicsClass.id,
          studentId: student.id
        }
      })
    ).flat()
  ].flat());

  console.log('✅ Added students to classes');

  // Create demo assignments
  const biologyAssignment = await prisma.assignment.create({
    data: {
      title: 'Kiểm tra Tế bào và Di truyền',
      description: 'Bài kiểm tra về cấu trúc tế bào và quy luật di truyền Mendel',
      subject: 'BIOLOGY',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isPublished: true,
      teacherId: teacher.id,
      classId: biologyClass.id
    }
  });

  const chemistryAssignment = await prisma.assignment.create({
    data: {
      title: 'Bài tập Cân bằng Hóa học',
      description: 'Bài tập về cân bằng hóa học và tính toán pH',
      subject: 'CHEMISTRY',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      isPublished: true,
      teacherId: teacher.id,
      classId: chemistryClass.id
    }
  });

  const physicsAssignment = await prisma.assignment.create({
    data: {
      title: 'Cơ học và Chuyển động',
      description: 'Bài tập về định luật Newton và chuyển động thẳng biến đổi đều',
      subject: 'PHYSICS',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      isPublished: true,
      teacherId: teacher.id,
      classId: physicsClass.id
    }
  });

  console.log('✅ Created demo assignments');

  // Create demo questions
  const biologyQuestions = await Promise.all([
    prisma.question.create({
      data: {
        type: 'MULTIPLE_CHOICE',
        question: 'Thành phần chính của màng tế bào là gì?',
        options: ['Protein', 'Lipid', 'Carbohydrate', 'DNA'],
        correctAnswer: 'Lipid',
        explanation: 'Màng tế bào chủ yếu được tạo thành từ lớp lipid kép (phospholipid bilayer)',
        points: 2,
        subject: 'BIOLOGY',
        topic: 'Tế bào',
        difficulty: 'EASY',
        assignmentId: biologyAssignment.id
      }
    }),
    prisma.question.create({
      data: {
        type: 'ESSAY',
        question: 'Giải thích quá trình nguyên phân và vai trò của nó trong sinh vật đa bào.',
        correctAnswer: null,
        explanation: 'Cần mô tả các giai đoạn của nguyên phân và vai trò tạo ra tế bào con giống tế bào mẹ',
        points: 5,
        subject: 'BIOLOGY',
        topic: 'Phân bào',
        difficulty: 'MEDIUM',
        assignmentId: biologyAssignment.id
      }
    })
  ]);

  const chemistryQuestions = await Promise.all([
    prisma.question.create({
      data: {
        type: 'EQUATION',
        question: 'Cân bằng phương trình hóa học: H₂ + O₂ → H₂O',
        correctAnswer: '2H₂ + O₂ → 2H₂O',
        explanation: 'Cân bằng số nguyên tử H và O ở hai vế phương trình',
        points: 3,
        subject: 'CHEMISTRY',
        topic: 'Phản ứng hóa học',
        difficulty: 'EASY',
        chemicalEquation: '2H₂ + O₂ → 2H₂O',
        assignmentId: chemistryAssignment.id
      }
    }),
    prisma.question.create({
      data: {
        type: 'CALCULATION',
        question: 'Tính pH của dung dịch HCl 0.01M',
        correctAnswer: 2,
        explanation: 'pH = -log[H⁺] = -log(0.01) = 2',
        points: 4,
        subject: 'CHEMISTRY',
        topic: 'Axit - Bazơ',
        difficulty: 'MEDIUM',
        formula: 'pH = -log[H⁺]',
        assignmentId: chemistryAssignment.id
      }
    })
  ]);

  const physicsQuestions = await Promise.all([
    prisma.question.create({
      data: {
        type: 'CALCULATION',
        question: 'Một vật rơi tự do từ độ cao 45m. Tính vận tốc khi chạm đất (g = 10m/s²)',
        correctAnswer: 30,
        explanation: 'Sử dụng công thức v² = u² + 2as với u = 0, a = g = 10m/s², s = 45m',
        points: 4,
        subject: 'PHYSICS',
        topic: 'Cơ học',
        difficulty: 'MEDIUM',
        formula: 'v² = u² + 2as',
        assignmentId: physicsAssignment.id
      }
    }),
    prisma.question.create({
      data: {
        type: 'MULTIPLE_CHOICE',
        question: 'Đơn vị của lực trong hệ SI là gì?',
        options: ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Pascal (Pa)'],
        correctAnswer: 'Newton (N)',
        explanation: 'Newton (N) là đơn vị đo lực trong hệ đo lường quốc tế SI',
        points: 2,
        subject: 'PHYSICS',
        topic: 'Lực và chuyển động',
        difficulty: 'EASY',
        assignmentId: physicsAssignment.id
      }
    })
  ]);

  console.log('✅ Created demo questions');

  // Update assignment total points
  await Promise.all([
    prisma.assignment.update({
      where: { id: biologyAssignment.id },
      data: { totalPoints: biologyQuestions.reduce((sum, q) => sum + q.points, 0) }
    }),
    prisma.assignment.update({
      where: { id: chemistryAssignment.id },
      data: { totalPoints: chemistryQuestions.reduce((sum, q) => sum + q.points, 0) }
    }),
    prisma.assignment.update({
      where: { id: physicsAssignment.id },
      data: { totalPoints: physicsQuestions.reduce((sum, q) => sum + q.points, 0) }
    })
  ]);

  console.log('✅ Updated assignment total points');

  // Create student progress records
  for (const student of students) {
    // Biology progress for all students
    await prisma.studentProgress.create({
      data: {
        studentId: student.id,
        assignmentId: biologyAssignment.id,
        status: 'NOT_STARTED',
        totalPoints: biologyQuestions.reduce((sum, q) => sum + q.points, 0),
        earnedPoints: 0,
        percentage: 0
      }
    });

    // Chemistry progress for first 2 students
    if (students.indexOf(student) < 2) {
      await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          assignmentId: chemistryAssignment.id,
          status: 'NOT_STARTED',
          totalPoints: chemistryQuestions.reduce((sum, q) => sum + q.points, 0),
          earnedPoints: 0,
          percentage: 0
        }
      });
    }

    // Physics progress for student 1 and 3
    if ([0, 2].includes(students.indexOf(student))) {
      await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          assignmentId: physicsAssignment.id,
          status: 'NOT_STARTED',
          totalPoints: physicsQuestions.reduce((sum, q) => sum + q.points, 0),
          earnedPoints: 0,
          percentage: 0
        }
      });
    }
  }

  console.log('✅ Created student progress records');

  // Create demo notifications
  for (const student of students) {
    await prisma.notification.create({
      data: {
        title: 'Chào mừng đến với ScienceEdu!',
        message: 'Bạn đã được thêm vào các lớp học. Hãy bắt đầu làm bài tập đầu tiên nhé!',
        type: 'INFO',
        userId: student.id
      }
    });
  }

  await prisma.notification.create({
    data: {
      title: 'Tài khoản giáo viên đã sẵn sàng',
      message: 'Chào mừng bạn đến với ScienceEdu! Bạn có thể bắt đầu tạo bài tập cho các lớp học của mình.',
      type: 'SUCCESS',
      userId: teacher.id
    }
  });

  console.log('✅ Created demo notifications');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo accounts created:');
  console.log('👨‍🏫 Teacher: teacher@scienceedu.demo / teacher123');
  console.log('👨‍🎓 Student 1: student1@scienceedu.demo / student123');
  console.log('👩‍🎓 Student 2: student2@scienceedu.demo / student123');
  console.log('👨‍🎓 Student 3: student3@scienceedu.demo / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });