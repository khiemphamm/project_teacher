// Database models for Science Education App

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS'; // Match database enum
  displayName: string;
  icon: string;
  color: string;
  topics: string[]; // Add topics array
  description?: string; // Add description
  isActive: boolean; // Add isActive flag
  createdAt: string; // API returns ISO strings
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject['name']; // Now matches 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS'
  questions: Question[];
  teacherId: string;
  teacher: User;
  dueDate: Date;
  totalPoints: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'calculation' | 'diagram' | 'equation';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
  subject: Subject['name'];
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Subject-specific fields
  formula?: string; // for physics calculations
  chemicalEquation?: string; // for chemistry
  diagramData?: Record<string, unknown>; // for biology diagrams
}

export interface StudentAnswer {
  id: string;
  studentId: string;
  assignmentId: string;
  questionId: string;
  answer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
  submittedAt: Date;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  student: User;
  assignmentId: string;
  assignment: Assignment;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  startedAt?: Date;
  submittedAt?: Date;
  gradedAt?: Date;
}

export interface Dashboard {
  totalStudents: number;
  totalAssignments: number;
  subjectStats: {
    subject: Subject['name']; // Now matches 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS' 
    assignmentCount: number;
    averageScore: number;
  }[];
  recentActivity: {
    type: 'submission' | 'assignment-created' | 'student-joined';
    message: string;
    timestamp: Date;
  }[];
}