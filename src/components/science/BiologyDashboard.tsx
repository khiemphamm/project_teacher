'use client';

import { useState } from 'react';
import { SUBJECTS, SAMPLE_QUESTIONS } from '@/lib/constants';
import { ArrowLeft, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface BiologyDashboardProps {
  onBack: () => void;
}

export default function BiologyDashboard({ onBack }: BiologyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'assignments'>('overview');
  const biologySubject = SUBJECTS.biology;

  const biologyQuestions = SAMPLE_QUESTIONS.biology;

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
                    Dashboard Giáo viên
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
                <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Bài tập</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
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
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            <div className="space-y-4">
              {biologyQuestions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          question.type === 'multiple-choice' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {question.type === 'multiple-choice' ? 'Trắc nghiệm' : 'Tự luận'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {question.topic}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {question.difficulty === 'easy' ? 'Dễ' : 'Trung bình'}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {question.question}
                      </h4>
                      {'options' in question && question.options && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="text-sm text-gray-600 dark:text-gray-300">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      {'explanation' in question && question.explanation && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <strong>Giải thích:</strong> {question.explanation}
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
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
          </div>
        )}
      </main>
    </div>
  );
}