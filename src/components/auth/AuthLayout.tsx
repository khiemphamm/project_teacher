'use client';

import { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ScienceEdu
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Hệ thống Giáo dục Khoa học
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
          © 2024 ScienceEdu. Được phát triển cho giáo dục Khoa học.
        </div>
      </div>
    </div>
  );
}