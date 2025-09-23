// Auth utilities

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  schoolId?: string | null;
  schoolName?: string;
};

export type UserRole = 'TEACHER' | 'STUDENT' | 'ADMIN';

export function isTeacher(user: AuthUser | null): boolean {
  return user?.role === 'TEACHER';
}

export function isStudent(user: AuthUser | null): boolean {
  return user?.role === 'STUDENT';
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN';
}

export function hasRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
}

// Route protection helpers
export const PROTECTED_ROUTES = {
  teacher: [
    '/dashboard/teacher',
    '/assignments/create',
    '/assignments/edit',
    '/questions/create',
    '/questions/edit',
    '/classes/manage',
    '/students/progress'
  ],
  student: [
    '/dashboard/student',
    '/assignments/take',
    '/assignments/results',
    '/progress'
  ],
  auth: [
    '/auth/login',
    '/auth/register'
  ]
};

export function isProtectedRoute(path: string, userRole?: string): boolean {
  if (!userRole) {
    return !PROTECTED_ROUTES.auth.some(route => path.startsWith(route));
  }

  const roleRoutes = PROTECTED_ROUTES[userRole as keyof typeof PROTECTED_ROUTES];
  if (!roleRoutes) return false;
  
  return roleRoutes.some(route => path.startsWith(route));
}

export function getRedirectPath(userRole: string): string {
  switch (userRole) {
    case 'TEACHER':
      return '/dashboard/teacher';
    case 'STUDENT':
      return '/dashboard/student';
    case 'ADMIN':
      return '/dashboard/admin';
    default:
      return '/';
  }
}

// Password validation
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ số');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// User display utilities
export function getUserDisplayName(user: Partial<AuthUser> | null): string {
  if (!user) return 'Người dùng';
  return user.name || user.email || 'Người dùng';
}

export function getUserAvatarFallback(user: Partial<AuthUser> | null): string {
  if (!user?.name) return 'U';
  const nameParts = user.name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return user.name[0].toUpperCase();
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'TEACHER':
      return 'Giáo viên';
    case 'STUDENT':
      return 'Học sinh';
    case 'ADMIN':
      return 'Quản trị viên';
    default:
      return 'Người dùng';
  }
}

// Session management
export const SESSION_CONFIG = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const
};

// Error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_EXISTS: 'Email đã được sử dụng',
  INVALID_EMAIL: 'Email không hợp lệ',
  WEAK_PASSWORD: 'Mật khẩu quá yếu',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  SESSION_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại'
};