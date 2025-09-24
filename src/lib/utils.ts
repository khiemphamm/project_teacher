import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color utilities for subjects
export const subjectColors = {
  BIOLOGY: {
    primary: 'bg-green-500',
    secondary: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  CHEMISTRY: {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  PHYSICS: {
    primary: 'bg-purple-500',
    secondary: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  }
} as const;

// Difficulty colors
export const difficultyColors = {
  EASY: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-300 dark:border-green-700'
  },
  MEDIUM: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-300 dark:border-yellow-700'
  },
  HARD: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700'
  }
} as const;

// Question type colors
export const questionTypeColors = {
  MULTIPLE_CHOICE: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700'
  },
  ESSAY: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-700'
  },
  CALCULATION: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-300 dark:border-orange-700'
  },
  DIAGRAM: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-300 dark:border-green-700'
  },
  EQUATION: {
    bg: 'bg-pink-100 dark:bg-pink-900/20',
    text: 'text-pink-800 dark:text-pink-200',
    border: 'border-pink-300 dark:border-pink-700'
  },
  TRUE_FALSE: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-300 dark:border-gray-600'
  }
} as const;

// Format utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' });
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    if (Math.abs(diffInHours) < 1) {
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      return rtf.format(diffInMinutes, 'minute');
    }
    return rtf.format(diffInHours, 'hour');
  }
  
  return rtf.format(diffInDays, 'day');
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getSubjectDisplayName(subject: string): string {
  const displayNames = {
    BIOLOGY: 'Sinh học',
    CHEMISTRY: 'Hóa học',
    PHYSICS: 'Vật lý'
  };
  return displayNames[subject as keyof typeof displayNames] || subject;
}

export function getDifficultyDisplayName(difficulty: string): string {
  const displayNames = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó'
  };
  return displayNames[difficulty as keyof typeof displayNames] || difficulty;
}

export function getQuestionTypeDisplayName(type: string): string {
  const displayNames = {
    MULTIPLE_CHOICE: 'Trắc nghiệm',
    ESSAY: 'Tự luận',
    CALCULATION: 'Tính toán',
    DIAGRAM: 'Sơ đồ',
    EQUATION: 'Phương trình',
    TRUE_FALSE: 'Đúng/Sai'
  };
  return displayNames[type as keyof typeof displayNames] || type;
}