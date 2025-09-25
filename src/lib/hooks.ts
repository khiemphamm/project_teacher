'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  apiClient, 
  PaginatedResponse,
  ClassData,
  AssignmentData,
  QuestionData,
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await apiClient.auth.getSession();
      setUser(session.user || null);
    } catch (err) {
      setUser(null);
      // Don't set error for missing session (user not logged in)
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await apiClient.auth.signOut();
      setUser(null);
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    isAdmin: user?.role === 'ADMIN',
    fetchSession,
    signOut,
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
  const [classes, setClasses] = useState<PaginatedResponse<ClassData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.classes.list(params);
      setClasses(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách lớp học';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
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

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.assignments.list(params);
      setAssignments(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách bài tập';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

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

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.questions.list(params);
      setQuestions(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách câu hỏi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

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