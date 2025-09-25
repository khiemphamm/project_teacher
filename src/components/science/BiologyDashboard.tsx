'use client';

import { useState, useEffect } from 'react';
import { SUBJECTS, SAMPLE_QUESTIONS } from '@/lib/constants';
import { ArrowLeft, Plus, Eye, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { 
  useAuth, 
  useQuestions, 
  useAssignments,
  useDeleteQuestion 
} from '@/lib/hooks';
import { apiClient, QuestionData } from '@/lib/api-client';

interface BiologyDashboardProps {
  onBack: () => void;
}

export default function BiologyDashboard({ onBack }: BiologyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'assignments'>('overview');
  const biologySubject = SUBJECTS.biology;

  // Authentication
  const { user, isAuthenticated, isTeacher } = useAuth();

  // API hooks
  const { questions, loading: questionsLoading, error: questionsError, refetch: refetchQuestions } = useQuestions({
    subject: 'BIOLOGY',
    limit: 20
  });
  
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments({
    subject: 'BIOLOGY',
    limit: 10
  });

  const { execute: deleteQuestion, loading: deletingQuestion } = useDeleteQuestion();

  // Fallback to sample data if API fails
  const displayQuestions = questions?.data.length ? questions.data : SAMPLE_QUESTIONS.biology;
  const displayAssignments = assignments?.data || [];

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      console.warn('Unauthorized access to Biology Dashboard');
    }
  }, [isAuthenticated, isTeacher]);

  // Handle question deletion
  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này không?')) return;
    
    try {
      await deleteQuestion(() => apiClient.questions.delete(questionId));
      refetchQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  // Loading state for initial auth check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Đang xác thực...</p>
        </div>
      </div>
    );
  }

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
                    Dashboard Giáo viên - {user?.name}
                  </p>
                </div>
              </div>
            </div>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Tạo bài tập mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng quan' },
              { id: 'questions', label: 'Ngân hàng câu hỏi' },
              { id: 'assignments', label: 'Bài tập' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'questions' | 'assignments')}
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Học sinh</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayAssignments.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Bài tập</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayQuestions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Câu hỏi</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Điểm TB</div>
              </div>
            </div>

            {/* Topics Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Chủ đề môn Sinh học
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {biologySubject.topics.map((topic) => (
                  <div
                    key={topic}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {topic}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {Math.floor(Math.random() * 20) + 5} câu hỏi
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ngân hàng câu hỏi Sinh học
              </h3>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            {/* Error State */}
            {questionsError && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200">
                    Lỗi tải câu hỏi: {questionsError}. Hiển thị dữ liệu mẫu.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {questionsLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">Đang tải câu hỏi...</p>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {displayQuestions.map((question, index) => {
                // Type guard for API vs sample data
                const isApiQuestion = 'id' in question;
                const questionData = question as QuestionData & { options?: string[]; explanation?: string; };
                
                return (
                  <div
                    key={isApiQuestion ? question.id : index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            questionData.type === 'MULTIPLE_CHOICE'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}>
                            {questionData.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : 'Tự luận'}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {questionData.topic}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            questionData.difficulty === 'EASY'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {questionData.difficulty === 'EASY' ? 'Dễ' : 'Trung bình'}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {questionData.question}
                        </h4>
                        {questionData.options && questionData.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {questionData.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="text-sm text-gray-600 dark:text-gray-300">
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        {questionData.explanation && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <strong>Giải thích:</strong> {questionData.explanation}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        {isApiQuestion && (
                          <button 
                            onClick={() => handleDeleteQuestion(questionData.id)}
                            disabled={deletingQuestion}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bài tập Sinh học
              </h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Tạo bài tập</span>
              </button>
            </div>

            {/* Error State */}
            {assignmentsError && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200">
                    Lỗi tải bài tập: {assignmentsError}
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {assignmentsLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">Đang tải bài tập...</p>
              </div>
            )}

            {/* Assignments List or Empty State */}
            {!assignmentsLoading && displayAssignments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa có bài tập nào
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tạo bài tập đầu tiên để bắt đầu
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Tạo bài tập đầu tiên
                </button>
              </div>
            )}

            {/* Assignments Grid */}
            {displayAssignments.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {assignment.description || 'Không có mô tả'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        assignment.isPublished
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {assignment.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {assignment._count.questions} câu hỏi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}