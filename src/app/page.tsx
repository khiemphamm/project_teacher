'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, BarChart3, Settings, Sun, Moon, LogOut, UserCircle, Trophy, Target, CheckCircle } from 'lucide-react';
import { useAuth, useSubjects } from '@/lib/hooks';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import BiologyDashboard from '@/components/science/BiologyDashboard';
import StudentBiologyDashboard from '@/components/science/StudentBiologyDashboard';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('teacher');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Authentication
  const { user, isAuthenticated, isTeacher } = useAuth();

  // Subjects
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Auto-select role based on authenticated user
  useEffect(() => {
    if (user) {
      setSelectedRole(isTeacher ? 'teacher' : 'student');
    }
  }, [user, isTeacher]);

  // Handle subject selection
  const handleSubjectClick = (subjectName: string) => {
    if (!isAuthenticated) {
      // Show login modal or redirect to login with callback
      const currentUrl = `${window.location.origin}?subject=${subjectName}`;
      window.location.href = `/login?callbackUrl=${encodeURIComponent(currentUrl)}`;
      return;
    }
    
    setSelectedSubject(subjectName);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setSelectedSubject(null);
  };

  // Show subject dashboard if selected
  if (selectedSubject === 'biology' && isAuthenticated) {
    // Show appropriate dashboard based on user role
    if (isTeacher) {
      return <BiologyDashboard onBack={handleBackToDashboard} />;
    } else {
      return <StudentBiologyDashboard onBack={handleBackToDashboard} />;
    }
  }

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
              {/* User Info or Role Toggle */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-2">
                    <UserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isTeacher ? 'Giáo viên' : 'Học sinh'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Role Toggle for non-authenticated users */}
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

                  {/* Auth Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </>
              )}

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
            {isAuthenticated 
              ? `Xin chào, ${user?.name}!` 
              : 'Chào mừng đến với ScienceEdu'
            }
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nền tảng giáo dục khoa học hiện đại cho Sinh học, Hóa học và Vật lý.
            {isAuthenticated
              ? (isTeacher 
                  ? ' Tạo và quản lý bài tập một cách dễ dàng.'
                  : ' Học tập và làm bài tập một cách thú vị.'
                )
              : (selectedRole === 'teacher' 
                  ? ' Tạo và quản lý bài tập một cách dễ dàng.'
                  : ' Học tập và làm bài tập một cách thú vị.'
                )
            }
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {subjectsLoading && (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Đang tải môn học...</p>
            </div>
          )}

          {subjectsError && (
            <div className="col-span-full text-center py-8">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Lỗi tải danh sách môn học
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {subjectsError}
              </p>
            </div>
          )}

          {!subjectsLoading && !subjectsError && subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.name.toLowerCase())}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer`}
            >
              <div className={`${subject.color} h-32 flex items-center justify-center`}>
                <span className="text-6xl">{subject.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {subject.displayName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {subject.topics && subject.topics.length > 0 
                    ? subject.topics.slice(0, 3).join(', ') + (subject.topics.length > 3 ? '...' : '')
                    : 'Đang cập nhật nội dung...'
                  }
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {subject.topics && subject.topics.length > 0 
                      ? `${subject.topics.length} chủ đề`
                      : 'Sắp ra mắt'
                    }
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    {!isAuthenticated 
                      ? 'Đăng nhập →' 
                      : isTeacher 
                        ? 'Vào Dashboard →' 
                        : 'Bắt đầu học →'
                    }
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

          {/* Show teacher features only to teachers or when not authenticated (for role selection) */}
          {(!isAuthenticated || isTeacher) && (
            <>
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
            </>
          )}

          {/* Show student features for students */}
          {isAuthenticated && !isTeacher && (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Theo dõi tiến độ
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Xem tiến độ học tập của bản thân
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Luyện tập cá nhân
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Rèn luyện kiến thức với câu hỏi thực hành
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Hoàn thành bài tập
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Nộp bài và nhận phản hồi tức thì
                </p>
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Sẵn sàng bắt đầu?
            </h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              {isAuthenticated 
                ? (isTeacher 
                    ? 'Hãy chọn môn học và bắt đầu tạo bài tập cho học sinh!'
                    : 'Hãy chọn môn học và bắt đầu học tập ngay hôm nay!'
                  )
                : `Hãy đăng ký tài khoản và ${selectedRole === 'teacher' ? 'tạo bài tập đầu tiên' : 'bắt đầu học tập'} ngay hôm nay!`
              }
            </p>
            {isAuthenticated ? (
              <button 
                onClick={() => handleSubjectClick('biology')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {isTeacher ? 'Vào Dashboard Sinh học' : 'Bắt đầu học Sinh học'}
              </button>
            ) : (
              <Link
                href="/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {selectedRole === 'teacher' ? 'Đăng ký làm Giáo viên' : 'Đăng ký làm Học sinh'}
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}