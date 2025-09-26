'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  mode: 'guest' | 'protected'; // guest: chỉ cho phép chưa đăng nhập, protected: chỉ cho phép đã đăng nhập
}

export default function AuthGuard({ children, redirectTo = '/', mode }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Vẫn đang tải session

    if (mode === 'guest') {
      // Trang dành cho guest (login, register) - redirect nếu đã đăng nhập
      if (session) {
        router.push(redirectTo);
      }
    } else if (mode === 'protected') {
      // Trang cần đăng nhập - redirect nếu chưa đăng nhập
      if (!session) {
        router.push('/login');
      }
    }
  }, [session, status, router, redirectTo, mode]);

  // Hiển thị loading khi đang kiểm tra session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Chặn hiển thị nếu không đúng điều kiện
  if (mode === 'guest' && session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Bạn đã đăng nhập
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Đang chuyển hướng về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'protected' && !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Cần đăng nhập
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  // Hiển thị nội dung nếu đúng điều kiện
  return <>{children}</>;
}