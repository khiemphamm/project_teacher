'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { 
  apiClient, 
  PaginatedResponse,
  ClassesPaginatedResponse,
  ClassData,
  AssignmentData,
  QuestionData,
  SubjectData,
} from '@/lib/api-client';
import { AuthUser } from '@/lib/auth-utils';

// Generic hook for API operations with loading and error states
export function useApiOperation<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Authentication hooks
export function useAuth() {
  const { data: session, status } = useSession();
  
  // Sign out
  const signOut = useCallback(async () => {
    try {
      // Use NextAuth signOut with redirect
      await nextAuthSignOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  // Convert NextAuth session to our AuthUser format
  const user: AuthUser | null = session?.user ? {
    id: session.user.id as string,
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role as string,
    avatar: session.user.image || null,
  } : null;

  return {
    user,
    loading: status === 'loading',
    error: null,
    isAuthenticated: status === 'authenticated',
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    isAdmin: user?.role === 'ADMIN',
    signOut,
  };
}

// Dashboard Stats hook
export function useDashboardStats(subject?: string) {
  const [stats, setStats] = useState<{
    totalStudents: number;
    totalAssignments: number;
    totalQuestions: number;
    averageScore: number | null;
    topicStats: Array<{
      topic: string;
      questionCount: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch parallel data with individual error handling
      const [questionsResponse, assignmentsResponse, classesResponse] = await Promise.allSettled([
        apiClient.questions.list({ subject, limit: 1000 }),
        apiClient.assignments.list({ subject, limit: 1000 }),
        apiClient.classes.list({ subject, limit: 1000 })
      ]);

      // Safely extract data arrays with fallbacks
      const questionsData = questionsResponse.status === 'fulfilled' && questionsResponse.value?.data || [];
      const assignmentsData = assignmentsResponse.status === 'fulfilled' && assignmentsResponse.value?.data || [];
      const classesData = classesResponse.status === 'fulfilled' && classesResponse.value?.classes || [];

      // Calculate topic statistics from all available questions
      const topicStats: Record<string, number> = {};
      questionsData.forEach((question) => {
        if (question?.topic) {
          topicStats[question.topic] = (topicStats[question.topic] || 0) + 1;
        }
      });

      // Count total students from all classes
      const totalStudents = classesData.reduce((sum: number, cls: ClassData) => {
        return sum + (cls?._count?.students || 0);
      }, 0);

      // Calculate average score only if we have actual submission data (null for now)
      // This would need to query submissions/results table when implemented
      const averageScore = null; // Set to null until we have real submission data

      setStats({
        totalStudents,
        totalAssignments: assignmentsData.length,
        totalQuestions: questionsData.length,
        averageScore,
        topicStats: Object.entries(topicStats).map(([topic, count]) => ({
          topic,
          questionCount: count
        }))
      });

      // Check for any rejected promises and log warnings
      const rejectedApis = [questionsResponse, assignmentsResponse, classesResponse]
        .map((response, index) => ({ response, api: ['questions', 'assignments', 'classes'][index] }))
        .filter(({ response }) => response.status === 'rejected');
      
      if (rejectedApis.length > 0) {
        console.warn('Some APIs failed:', rejectedApis.map(({ api, response }) => 
          `${api}: ${response.status === 'rejected' ? response.reason : 'unknown'}`
        ));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thống kê';
      setError(errorMessage);
      // Fallback data
      setStats({
        totalStudents: 0,
        totalAssignments: 0,
        totalQuestions: 0,
        averageScore: null,
        topicStats: []
      });
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// Subjects hooks
export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.subjects.list();
      setSubjects(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách môn học';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading,
    error,
    refetch: fetchSubjects,
  };
}

// Classes hooks
export function useClasses(params: {
  page?: number;
  limit?: number;
  subject?: string;
  grade?: string;
  search?: string;
} = {}) {
  const [classes, setClasses] = useState<ClassesPaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract individual params to avoid object reference issues
  const { page, limit, subject, grade, search } = params;

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.classes.list({
        page,
        limit,
        subject,
        grade,
        search
      });
      setClasses(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách lớp học';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, subject, grade, search]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes: classes?.classes || [],
    pagination: classes?.pagination,
    loading,
    error,
    refetch: fetchClasses,
  };
}

export function useClass(id: string) {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.classes.get(id);
      setClassData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin lớp học';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  return {
    classData,
    loading,
    error,
    refetch: fetchClass,
  };
}

export function useCreateClass() {
  return useApiOperation<ClassData>();
}

export function useUpdateClass() {
  return useApiOperation<ClassData>();
}

export function useDeleteClass() {
  return useApiOperation<void>();
}

// Assignments hooks
export function useAssignments(params: {
  page?: number;
  limit?: number;
  subject?: string;
  published?: boolean;
  search?: string;
  classId?: string;
} = {}) {
  const [assignments, setAssignments] = useState<PaginatedResponse<AssignmentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract individual params to avoid object reference issues
  const { page, limit, subject, published, search, classId } = params;

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.assignments.list({
        page,
        limit,
        subject,
        published,
        search,
        classId
      });
      setAssignments(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách bài tập';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, subject, published, search, classId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    refetch: fetchAssignments,
  };
}

export function useAssignment(id: string) {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignment = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.assignments.get(id);
      setAssignment(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin bài tập';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  return {
    assignment,
    loading,
    error,
    refetch: fetchAssignment,
  };
}

export function useCreateAssignment() {
  return useApiOperation<AssignmentData>();
}

export function useUpdateAssignment() {
  return useApiOperation<AssignmentData>();
}

export function usePublishAssignment() {
  return useApiOperation<AssignmentData>();
}

export function useDeleteAssignment() {
  return useApiOperation<void>();
}

// Questions hooks
export function useQuestions(params: {
  page?: number;
  limit?: number;
  subject?: string;
  difficulty?: string;
  type?: string;
  search?: string;
  assignmentId?: string;
} = {}) {
  const [questions, setQuestions] = useState<PaginatedResponse<QuestionData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract individual params to avoid object reference issues
  const { page, limit, subject, difficulty, type, search, assignmentId } = params;

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.questions.list({
        page,
        limit,
        subject,
        difficulty,
        type,
        search,
        assignmentId
      });
      setQuestions(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách câu hỏi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, subject, difficulty, type, search, assignmentId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
}

export function useQuestion(id: string) {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.questions.get(id);
      setQuestion(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin câu hỏi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return {
    question,
    loading,
    error,
    refetch: fetchQuestion,
  };
}

export function useCreateQuestion() {
  return useApiOperation<QuestionData>();
}

export function useUpdateQuestion() {
  return useApiOperation<QuestionData>();
}

export function useDeleteQuestion() {
  return useApiOperation<void>();
}

// Utility hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function usePagination(initialPage: number = 1, initialLimit: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage(p => p + 1), []);
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const goToPage = useCallback((pageNumber: number) => setPage(Math.max(1, pageNumber)), []);
  const setPageSize = useCallback((size: number) => {
    setLimit(size);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    reset,
  };
}