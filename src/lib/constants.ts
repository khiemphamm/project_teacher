// Constants for Science Education App

export const SUBJECTS = {
  biology: {
    name: 'biology' as const,
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
    ]
  },
  chemistry: {
    name: 'chemistry' as const,
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
    ]
  },
  physics: {
    name: 'physics' as const,
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
    ]
  }
} as const;

export const QUESTION_TYPES = {
  'multiple-choice': 'Trả lời ngắn',
  'essay': 'Tự luận',
  'calculation': 'Tính toán',
  'diagram': 'Sơ đồ',
  'equation': 'Phương trình'
} as const;

export const DIFFICULTY_LEVELS = {
  easy: { label: 'Dễ', color: 'text-green-600' },
  medium: { label: 'Trung bình', color: 'text-yellow-600' },
  hard: { label: 'Khó', color: 'text-red-600' }
} as const;

export const USER_ROLES = {
  teacher: 'Giáo viên',
  student: 'Học sinh'
} as const;

// Sample data for development
export const SAMPLE_QUESTIONS = {
  biology: [
    {
      type: 'multiple-choice',
      question: 'Thành phần chính của màng tế bào là gì?',
      options: ['Protein', 'Lipid', 'Carbohydrate', 'DNA'],
      correctAnswer: 'Lipid',
      explanation: 'Màng tế bào chủ yếu được tạo thành từ lớp lipid kép',
      topic: 'Tế bào',
      difficulty: 'easy'
    },
    {
      type: 'essay',
      question: 'Giải thích quá trình quang hợp ở thực vật',
      topic: 'Quang hợp',
      difficulty: 'medium'
    }
  ],
  chemistry: [
    {
      type: 'equation',
      question: 'Cân bằng phương trình: H₂ + O₂ → H₂O',
      correctAnswer: '2H₂ + O₂ → 2H₂O',
      topic: 'Phản ứng hóa học',
      difficulty: 'easy'
    },
    {
      type: 'calculation',
      question: 'Tính pH của dung dịch HCl 0.1M',
      correctAnswer: 1,
      formula: 'pH = -log[H⁺]',
      topic: 'Axit - Bazơ',
      difficulty: 'medium'
    }
  ],
  physics: [
    {
      type: 'calculation',
      question: 'Một vật rơi tự do từ độ cao 20m. Tính vận tốc khi chạm đất (g = 10m/s²)',
      correctAnswer: 20,
      formula: 'v² = u² + 2as',
      topic: 'Cơ học',
      difficulty: 'medium'
    },
    {
      type: 'multiple-choice',
      question: 'Đơn vị của công suất là gì?',
      options: ['Joule', 'Watt', 'Newton', 'Pascal'],
      correctAnswer: 'Watt',
      topic: 'Năng lượng',
      difficulty: 'easy'
    }
  ]
} as const;