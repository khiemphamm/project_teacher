'use client';

import { useState, useEffect } from 'react';
import { SUBJECTS } from '@/lib/constants';
import { ArrowLeft, BookOpen, Clock, Trophy, Target, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

interface StudentBiologyDashboardProps {
  onBack: () => void;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score?: number;
  totalQuestions: number;
  completedQuestions: number;
}

// Sample assignments for students
const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Cấu trúc tế bào - Bài kiểm tra số 1',
    description: 'Kiểm tra kiến thức về cấu trúc và chức năng của tế bào',
    dueDate: '2025-10-01',
    status: 'NOT_STARTED',
    totalQuestions: 15,
    completedQuestions: 0
  },
  {
    id: '2',
    title: 'Di truyền học cơ bản',
    description: 'Bài tập về quy luật Mendel và di truyền phân tử',
    dueDate: '2025-09-28',
    status: 'IN_PROGRESS',
    score: 7.5,
    totalQuestions: 20,
    completedQuestions: 12
  },
  {
    id: '3',
    title: 'Sinh thái học',
    description: 'Khám phá mối quan hệ sinh vật và môi trường',
    dueDate: '2025-09-25',
    status: 'COMPLETED',
    score: 8.5,
    totalQuestions: 18,
    completedQuestions: 18
  }
];

export default function StudentBiologyDashboard({ onBack }: StudentBiologyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'practice' | 'progress'>('assignments');
  const biologySubject = SUBJECTS.biology;

  // Authentication
  const { user, isAuthenticated, isTeacher } = useAuth();

  // Sample data for student assignments
  const [assignments] = useState<Assignment[]>(SAMPLE_ASSIGNMENTS);

  // Block non-students (teachers shouldn't access student dashboard)
  useEffect(() => {
    if (!isAuthenticated) {
      // Don't redirect immediately, let the loading state handle it
      return;
    }
    
    if (isTeacher) {
      alert('Đây là giao diện dành cho Học sinh!');
      onBack();
      return;
    }
  }, [isAuthenticated, isTeacher, onBack]);

  // Loading state for initial auth check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Block teachers
  if (isAuthenticated && isTeacher) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-600 text-6xl mb-4">👨‍🎓</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Giao diện Học sinh
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Đây là khu vực dành riêng cho học sinh
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay về Dashboard Giáo viên
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress stats
  const completedAssignments = assignments.filter(a => a.status === 'COMPLETED').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'IN_PROGRESS').length;
  const averageScore = assignments
    .filter(a => a.score)
    .reduce((acc, a) => acc + (a.score || 0), 0) / assignments.filter(a => a.score).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`${biologySubject.color} p-2 rounded-lg text-white`}>
                  <span className="text-xl">{biologySubject.icon}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {biologySubject.displayName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Học tập - {user?.name}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Điểm trung bình
                </div>
                <div className="text-lg font-bold text-green-600">
                  {averageScore.toFixed(1)}/10
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'assignments', label: 'Bài tập của tôi' },
              { id: 'practice', label: 'Luyện tập' },
              { id: 'progress', label: 'Tiến độ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'assignments' | 'practice' | 'progress')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {assignments.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Tổng bài tập</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {inProgressAssignments}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Đang làm</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {completedAssignments}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Hoàn thành</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {averageScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Điểm TB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bài tập được giao
              </h3>
              
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          assignment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : assignment.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {assignment.status === 'COMPLETED' ? 'Hoàn thành' : 
                           assignment.status === 'IN_PROGRESS' ? 'Đang làm' : 'Chưa bắt đầu'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          Hạn nộp: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                        </div>
                        <div>
                          Tiến độ: {assignment.completedQuestions}/{assignment.totalQuestions} câu
                        </div>
                        {assignment.score && (
                          <div className="text-green-600 dark:text-green-400 font-medium">
                            Điểm: {assignment.score}/10
                          </div>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            assignment.status === 'COMPLETED' ? 'bg-green-500' :
                            assignment.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{
                            width: `${(assignment.completedQuestions / assignment.totalQuestions) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors ${
                        assignment.status === 'COMPLETED'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}>
                        <Play className="w-4 h-4" />
                        <span>
                          {assignment.status === 'COMPLETED' ? 'Xem lại' : 
                           assignment.status === 'IN_PROGRESS' ? 'Tiếp tục' : 'Bắt đầu'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Luyện tập Sinh học
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Rèn luyện kiến thức với các câu hỏi thực hành theo từng chủ đề
              </p>
            </div>

            {/* Topics Grid for Practice */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biologySubject.topics.map((topic) => (
                <div
                  key={topic}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`${biologySubject.color} p-2 rounded-lg text-white`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {topic}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Luyện tập với {Math.floor(Math.random() * 30) + 10} câu hỏi
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Độ khó: {Math.random() > 0.5 ? 'Trung bình' : 'Dễ'}
                    </span>
                    <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Bắt đầu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tiến độ học tập
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Theo dõi quá trình học tập và thành tích của bạn
              </p>
            </div>

            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tổng quan tiến độ
              </h4>
              
              <div className="space-y-4">
                {biologySubject.topics.map((topic) => {
                  const progress = Math.floor(Math.random() * 100);
                  const questionsCompleted = Math.floor(Math.random() * 20) + 5;
                  
                  return (
                    <div key={topic} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {topic}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {progress}% • {questionsCompleted} câu hỏi
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progress >= 80 ? 'bg-green-500' :
                              progress >= 60 ? 'bg-yellow-500' :
                              progress >= 30 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Hoạt động gần đây
              </h4>
              
              <div className="space-y-3">
                {[
                  { action: 'Hoàn thành bài tập', subject: 'Sinh thái học', time: '2 giờ trước', score: 8.5 },
                  { action: 'Luyện tập', subject: 'Cấu trúc tế bào', time: '1 ngày trước', score: null },
                  { action: 'Nộp bài tập', subject: 'Di truyền học', time: '2 ngày trước', score: 7.5 },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300"> - {activity.subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                      {activity.score && (
                        <div className="text-green-600 dark:text-green-400 font-medium">
                          {activity.score}/10
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}