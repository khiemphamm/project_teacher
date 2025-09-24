import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// App State Store
interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;

  // Current Subject
  currentSubject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS' | null;
  setCurrentSubject: (subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS' | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        // Update document class for dark mode
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newDarkMode);
        }
      },
      setDarkMode: (dark: boolean) => {
        set({ darkMode: dark });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', dark);
        }
      },

      // Current Subject
      currentSubject: null,
      setCurrentSubject: (subject) => set({ currentSubject: subject }),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          autoClose: notification.autoClose ?? true
        };
        set({ notifications: [...get().notifications, newNotification] });

        // Auto remove after 5 seconds if autoClose is true
        if (newNotification.autoClose) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, 5000);
        }
      },
      removeNotification: (id) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id)
        });
      },
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'scienceedu-app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentSubject: state.currentSubject,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
);

// Dashboard State Store
interface DashboardState {
  // Stats
  stats: {
    totalStudents: number;
    totalAssignments: number;
    totalQuestions: number;
    averageScore: number;
  };
  setStats: (stats: DashboardState['stats']) => void;

  // Active Tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Selected Items
  selectedQuestions: string[];
  selectedAssignments: string[];
  toggleQuestionSelection: (questionId: string) => void;
  toggleAssignmentSelection: (assignmentId: string) => void;
  clearSelections: () => void;

  // Filters
  filters: {
    subject?: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    questionType?: string;
    topic?: string;
  };
  setFilters: (filters: Partial<DashboardState['filters']>) => void;
  clearFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Stats
  stats: {
    totalStudents: 0,
    totalAssignments: 0,
    totalQuestions: 0,
    averageScore: 0
  },
  setStats: (stats) => set({ stats }),

  // Active Tab
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Selected Items
  selectedQuestions: [],
  selectedAssignments: [],
  toggleQuestionSelection: (questionId) => {
    const selected = get().selectedQuestions;
    const isSelected = selected.includes(questionId);
    set({
      selectedQuestions: isSelected
        ? selected.filter((id) => id !== questionId)
        : [...selected, questionId]
    });
  },
  toggleAssignmentSelection: (assignmentId) => {
    const selected = get().selectedAssignments;
    const isSelected = selected.includes(assignmentId);
    set({
      selectedAssignments: isSelected
        ? selected.filter((id) => id !== assignmentId)
        : [...selected, assignmentId]
    });
  },
  clearSelections: () => set({ selectedQuestions: [], selectedAssignments: [] }),

  // Filters
  filters: {},
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  clearFilters: () => set({ filters: {} }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query })
}));

// Question Store
interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
  subject: string;
  topic: string;
  difficulty: string;
  formula?: string;
  chemicalEquation?: string;
  diagramData?: Record<string, unknown>;
}

interface QuestionState {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set({ questions: [...get().questions, question] }),
  updateQuestion: (id, updatedQuestion) => {
    set({
      questions: get().questions.map((q) =>
        q.id === id ? { ...q, ...updatedQuestion } : q
      )
    });
  },
  deleteQuestion: (id) => {
    set({ questions: get().questions.filter((q) => q.id !== id) });
  },
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading })
}));