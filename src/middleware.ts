import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirect authenticated users away from auth pages (login, register)
    if (token && (pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth/'))) {
      const redirectUrl = getRedirectUrl(token.role as string);
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Check role-based access
    if (token && !hasAccess(pathname, token.role as string)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public pages
        if (isPublicPage(pathname)) {
          return true;
        }

        // Allow access to auth pages if not authenticated
        if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth/')) {
          return true;
        }

        // Require authentication for protected pages
        return !!token;
      }
    }
  }
);

function isPublicPage(pathname: string): boolean {
  const publicPages = [
    '/',
    '/about',
    '/contact',
    '/features',
    '/api/auth',
    '/login',
    '/register',
    '/unauthorized'
  ];

  return publicPages.some(page => pathname.startsWith(page));
}

function hasAccess(pathname: string, role: string): boolean {
  // Teacher routes
  if (pathname.startsWith('/dashboard/teacher') || 
      pathname.startsWith('/assignments/create') ||
      pathname.startsWith('/assignments/edit') ||
      pathname.startsWith('/questions/create') ||
      pathname.startsWith('/questions/edit') ||
      pathname.startsWith('/classes/manage') ||
      pathname.startsWith('/students/progress')) {
    return role === 'TEACHER';
  }

  // Student routes
  if (pathname.startsWith('/dashboard/student') ||
      pathname.startsWith('/assignments/take') ||
      pathname.startsWith('/assignments/results') ||
      pathname.startsWith('/progress')) {
    return role === 'STUDENT';
  }

  // Admin routes
  if (pathname.startsWith('/dashboard/admin') ||
      pathname.startsWith('/admin/')) {
    return role === 'ADMIN';
  }

  // Default allow for other authenticated routes
  return true;
}

function getRedirectUrl(role: string): string {
  switch (role) {
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)'
  ]
};