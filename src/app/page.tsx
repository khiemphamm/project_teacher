'use client';

import { useState } from 'react';
import { SUBJECTS } from '@/lib/constants';
import { BookOpen, Users, BarChart3, Settings, Sun, Moon } from 'lucide-react';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('teacher');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧬</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  ScienceEdu
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hệ thống Giáo dục Khoa học
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Role Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedRole('teacher')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedRole === 'teacher'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Giáo viên
                </button>
                <button
                  onClick={() => setSelectedRole('student')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedRole === 'student'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Học sinh
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Chào mừng đến với ScienceEdu
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nền tảng giáo dục khoa học hiện đại cho Sinh học, Hóa học và Vật lý.
            {selectedRole === 'teacher' 
              ? ' Tạo và quản lý bài tập một cách dễ dàng.'
              : ' Học tập và làm bài tập một cách thú vị.'
            }
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Object.values(SUBJECTS).map((subject) => (
            <div
              key={subject.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className={`${subject.color} h-32 flex items-center justify-center`}>
                <span className="text-6xl">{subject.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {subject.displayName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {subject.topics.slice(0, 3).join(', ')}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {subject.topics.length} chủ đề
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Bài tập đa dạng
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Trắc nghiệm, tự luận, tính toán và sơ đồ
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Quản lý lớp học
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Theo dõi tiến độ học sinh hiệu quả
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Báo cáo chi tiết
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Thống kê và phân tích kết quả học tập
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Tùy chỉnh linh hoạt
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Cài đặt theo nhu cầu từng môn học
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Sẵn sàng bắt đầu?
            </h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Hãy chọn môn học và {selectedRole === 'teacher' ? 'tạo bài tập đầu tiên' : 'bắt đầu học tập'} ngay hôm nay!
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {selectedRole === 'teacher' ? 'Tạo bài tập' : 'Bắt đầu học'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}