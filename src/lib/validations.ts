import { z } from 'zod';

// User Validation Schemas
export const createUserSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.enum(['TEACHER', 'STUDENT'], {
    message: 'Vai trò phải là TEACHER hoặc STUDENT'
  }),
  schoolId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống')
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional(),
  schoolId: z.string().optional()
});

// Assignment Validation Schemas
export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  subject: z.enum(['BIOLOGY', 'CHEMISTRY', 'PHYSICS'], {
    message: 'Môn học phải là BIOLOGY, CHEMISTRY hoặc PHYSICS'
  }),
  dueDate: z.date().optional(),
  classId: z.string().min(1, 'Lớp học không được để trống')
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

// Question Validation Schemas
export const createQuestionSchema = z.object({
  type: z.enum(['MULTIPLE_CHOICE', 'ESSAY', 'CALCULATION', 'DIAGRAM', 'EQUATION', 'TRUE_FALSE'], {
    message: 'Loại câu hỏi không hợp lệ'
  }),
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  options: z.array(z.string()).default([]),
  correctAnswer: z.any().optional(),
  explanation: z.string().optional(),
  points: z.number().min(1, 'Điểm phải lớn hơn 0').default(1),
  subject: z.enum(['BIOLOGY', 'CHEMISTRY', 'PHYSICS']),
  topic: z.string().min(1, 'Chủ đề không được để trống'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  formula: z.string().optional(),
  chemicalEquation: z.string().optional(),
  diagramData: z.any().optional(),
  assignmentId: z.string().min(1, 'Bài tập không được để trống')
});

export const updateQuestionSchema = createQuestionSchema.partial().omit({ assignmentId: true });

// Class Validation Schemas
export const createClassSchema = z.object({
  name: z.string().min(1, 'Tên lớp không được để trống'),
  grade: z.string().min(1, 'Khối không được để trống'),
  subject: z.enum(['BIOLOGY', 'CHEMISTRY', 'PHYSICS']),
  description: z.string().optional(),
  schoolId: z.string().optional()
});

export const updateClassSchema = createClassSchema.partial();

// Student Answer Validation Schemas
export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'ID câu hỏi không được để trống'),
  answer: z.any(), // Can be string, number, array, object depending on question type
  timeSpent: z.number().min(0, 'Thời gian không được âm').optional()
});

// School Validation Schemas
export const createSchoolSchema = z.object({
  name: z.string().min(1, 'Tên trường không được để trống'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional()
});

export const updateSchoolSchema = createSchoolSchema.partial();

// Notification Validation Schemas
export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  message: z.string().min(1, 'Nội dung không được để trống'),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ASSIGNMENT', 'GRADE']).default('INFO'),
  userId: z.string().min(1, 'ID người dùng không được để trống')
});

// API Response Types
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional()
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Trang phải lớn hơn 0').default(1),
  limit: z.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit không được vượt quá 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Filter Schemas
export const assignmentFilterSchema = z.object({
  subject: z.enum(['BIOLOGY', 'CHEMISTRY', 'PHYSICS']).optional(),
  classId: z.string().optional(),
  isPublished: z.boolean().optional(),
  teacherId: z.string().optional()
});

export const questionFilterSchema = z.object({
  subject: z.enum(['BIOLOGY', 'CHEMISTRY', 'PHYSICS']).optional(),
  type: z.enum(['MULTIPLE_CHOICE', 'ESSAY', 'CALCULATION', 'DIAGRAM', 'EQUATION', 'TRUE_FALSE']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  topic: z.string().optional(),
  assignmentId: z.string().optional()
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AssignmentFilterInput = z.infer<typeof assignmentFilterSchema>;
export type QuestionFilterInput = z.infer<typeof questionFilterSchema>;