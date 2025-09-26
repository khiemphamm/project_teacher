// API Client for ScienceEdu Platform
import { AuthUser } from './auth-utils';

// API Base URL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3000';

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  details?: string[];
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ClassesPaginatedResponse {
  classes: ClassData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth API Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'TEACHER' | 'STUDENT';
}

export interface SessionData {
  user?: AuthUser;
}

// Subject API Types
export interface SubjectData {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  topics: string[];
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectData {
  name: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  displayName: string;
  icon: string;
  color: string;
  topics?: string[];
  description?: string;
}

// Classes API Types
export interface ClassData {
  id: string;
  name: string;
  grade: string;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  description?: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    students: number;
    assignments: number;
  };
  createdAt: string;
}

export interface CreateClassData {
  name: string;
  grade: string;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  description?: string;
}

// Assignments API Types
export interface AssignmentData {
  id: string;
  title: string;
  description?: string;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  dueDate?: string;
  totalPoints: number;
  isPublished: boolean;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  class: {
    id: string;
    name: string;
    grade: string;
  };
  _count: {
    questions: number;
    studentProgress: number;
  };
  createdAt: string;
}

export interface CreateAssignmentData {
  title: string;
  description?: string;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  dueDate?: Date;
  classId: string;
}

// Questions API Types
export interface QuestionData {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY' | 'CALCULATION' | 'DIAGRAM' | 'EQUATION' | 'TRUE_FALSE';
  question: string;
  options: string[];
  correctAnswer?: string | number | boolean | string[];
  explanation?: string;
  points: number;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  formula?: string;
  chemicalEquation?: string;
  diagramData?: Record<string, unknown>;
  assignment: {
    id: string;
    title: string;
    teacher: {
      id: string;
      name: string;
    };
  };
  _count: {
    studentAnswers: number;
  };
  createdAt: string;
}

export interface CreateQuestionData {
  type: 'MULTIPLE_CHOICE' | 'ESSAY' | 'CALCULATION' | 'DIAGRAM' | 'EQUATION' | 'TRUE_FALSE';
  question: string;
  options?: string[];
  correctAnswer?: string | number | boolean | string[];
  explanation?: string;
  points: number;
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  formula?: string;
  chemicalEquation?: string;
  diagramData?: Record<string, unknown>;
  assignmentId: string;
}

// Generic fetch wrapper with error handling
async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Call failed for ${endpoint}:`, error);
    throw error;
  }
}

// API Client Object
export const apiClient = {
  // Authentication
  auth: {
    register: async (data: RegisterData): Promise<ApiResponse> => {
      return apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    getSession: async (): Promise<SessionData> => {
      return apiCall('/auth/session');
    },

    signOut: async (): Promise<void> => {
      // Use NextAuth signout endpoint
      await fetch('/api/auth/signout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    },
  },

  // Subjects
  subjects: {
    list: async (): Promise<SubjectData[]> => {
      return apiCall('/subjects');
    },

    create: async (data: CreateSubjectData): Promise<SubjectData> => {
      return apiCall('/subjects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // Classes
  classes: {
    list: async (params: {
      page?: number;
      limit?: number;
      subject?: string;
      grade?: string;
      search?: string;
    } = {}): Promise<ClassesPaginatedResponse> => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, value.toString());
      });
      
      return apiCall(`/classes?${searchParams.toString()}`);
    },

    create: async (data: CreateClassData): Promise<ClassData> => {
      return apiCall('/classes', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    get: async (id: string): Promise<ClassData> => {
      return apiCall(`/classes/${id}`);
    },

    update: async (id: string, data: Partial<CreateClassData>): Promise<ClassData> => {
      return apiCall(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string): Promise<void> => {
      return apiCall(`/classes/${id}`, { method: 'DELETE' });
    },
  },

  // Assignments
  assignments: {
    list: async (params: {
      page?: number;
      limit?: number;
      subject?: string;
      published?: boolean;
      search?: string;
      classId?: string;
    } = {}): Promise<PaginatedResponse<AssignmentData>> => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, value.toString());
      });
      
      return apiCall(`/assignments?${searchParams.toString()}`);
    },

    create: async (data: CreateAssignmentData): Promise<AssignmentData> => {
      return apiCall('/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    get: async (id: string): Promise<AssignmentData> => {
      return apiCall(`/assignments/${id}`);
    },

    update: async (id: string, data: Partial<CreateAssignmentData>): Promise<AssignmentData> => {
      return apiCall(`/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    publish: async (id: string, isPublished: boolean): Promise<AssignmentData> => {
      return apiCall(`/assignments/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished }),
      });
    },

    delete: async (id: string): Promise<void> => {
      return apiCall(`/assignments/${id}`, { method: 'DELETE' });
    },
  },

  // Questions
  questions: {
    list: async (params: {
      page?: number;
      limit?: number;
      subject?: string;
      difficulty?: string;
      type?: string;
      search?: string;
      assignmentId?: string;
    } = {}): Promise<PaginatedResponse<QuestionData>> => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, value.toString());
      });
      
      return apiCall(`/questions?${searchParams.toString()}`);
    },

    create: async (data: CreateQuestionData): Promise<QuestionData> => {
      return apiCall('/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    get: async (id: string): Promise<QuestionData> => {
      return apiCall(`/questions/${id}`);
    },

    update: async (id: string, data: Partial<CreateQuestionData>): Promise<QuestionData> => {
      return apiCall(`/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string): Promise<void> => {
      return apiCall(`/questions/${id}`, { method: 'DELETE' });
    },
  },
};