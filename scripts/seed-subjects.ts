import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding subjects...');

  // Clear existing subjects (optional)
  await prisma.subjectInfo.deleteMany({});

  // Seed subjects
  const subjects = [
    {
      name: 'BIOLOGY' as const,
      displayName: 'Sinh học',
      icon: '🧬',
      color: 'bg-green-500',
      topics: [
        'Tế bào',
        'Di truyền học',
        'Sinh thái học',
        'Sinh lý học',
        'Tiến hóa',
        'Hệ thần kinh',
        'Hệ tuần hoàn',
        'Quang hợp'
      ],
      description: 'Khoa học nghiên cứu về sự sống và các sinh vật'
    },
    {
      name: 'CHEMISTRY' as const,
      displayName: 'Hóa học',
      icon: '⚗️',
      color: 'bg-blue-500',
      topics: [
        'Bảng tuần hoàn',
        'Liên kết hóa học',
        'Phản ứng hóa học',
        'Cân bằng hóa học',
        'Axit - Bazơ',
        'Oxi hóa - Khử',
        'Hóa hữu cơ',
        'Động học phản ứng'
      ],
      description: 'Khoa học nghiên cứu về cấu trúc, tính chất và phản ứng của các chất'
    },
    {
      name: 'PHYSICS' as const,
      displayName: 'Vật lý',
      icon: '⚡',
      color: 'bg-purple-500',
      topics: [
        'Cơ học',
        'Nhiệt học',
        'Điện học',
        'Quang học',
        'Vật lý nguyên tử',
        'Sóng',
        'Từ trường',
        'Năng lượng'
      ],
      description: 'Khoa học nghiên cứu về vật chất, năng lượng và các tương tác'
    }
  ];

  for (const subject of subjects) {
    const created = await prisma.subjectInfo.create({
      data: {
        name: subject.name,
        displayName: subject.displayName,
        icon: subject.icon,
        color: subject.color,
        topics: subject.topics,
        description: subject.description
      }
    });
    console.log(`✅ Created subject: ${created.displayName}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });