'use client';

import * as React from 'react';
import { FlaskConical, Plus, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { SubjectBadge, DifficultyBadge, StatusBadge } from './common';

interface ChemistryQuestion extends Record<string, unknown> {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'CALCULATION' | 'CHEMICAL_EQUATION' | 'DIAGRAM';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  points: number;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: Date;
}

interface Assignment extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  questionsCount: number;
  studentsCount: number;
  averageScore?: number;
}

// Mock data
const mockQuestions: ChemistryQuestion[] = [
  {
    id: '1',
    question: 'Phương trình phân ly của HCl trong nước là:',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'EASY',
    topic: 'Axit-Bazơ',
    points: 2,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    question: 'Tính khối lượng NaCl cần thiết để pha 500ml dung dịch 0.1M',
    type: 'CALCULATION',
    difficulty: 'MEDIUM',
    topic: 'Dung dịch',
    points: 5,
    status: 'DRAFT',
    createdAt: new Date('2024-01-14')
  }
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Kiểm tra Axit-Bazơ',
    description: 'Bài kiểm tra về tính chất và phản ứng của axit bazơ',
    dueDate: new Date('2024-02-01'),
    status: 'PUBLISHED',
    questionsCount: 15,
    studentsCount: 25,
    averageScore: 7.5
  },
  {
    id: '2',
    title: 'Bài tập Dung dịch',
    description: 'Bài tập về nồng độ và tính toán dung dịch',
    dueDate: new Date('2024-02-05'),
    status: 'DRAFT',
    questionsCount: 10,
    studentsCount: 0
  }
];

export function ChemistryDashboard() {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = React.useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const questionColumns = [
    {
      key: 'question' as keyof ChemistryQuestion,
      header: 'Câu hỏi',
      cell: (value: unknown) => (
        <div className="max-w-md">
          <p className="truncate font-medium">{String(value)}</p>
        </div>
      )
    },
    {
      key: 'type' as keyof ChemistryQuestion,
      header: 'Loại',
      cell: (value: unknown) => {
        const typeMap = {
          'MULTIPLE_CHOICE': 'Trắc nghiệm',
          'CALCULATION': 'Tính toán',
          'CHEMICAL_EQUATION': 'Phương trình',
          'DIAGRAM': 'Sơ đồ'
        };
        return <Badge variant="outline">{typeMap[String(value) as keyof typeof typeMap] || String(value)}</Badge>;
      }
    },
    {
      key: 'difficulty' as keyof ChemistryQuestion,
      header: 'Độ khó',
      cell: (value: unknown) => <DifficultyBadge difficulty={String(value) as 'EASY' | 'MEDIUM' | 'HARD'} />
    },
    {
      key: 'topic' as keyof ChemistryQuestion,
      header: 'Chủ đề',
      cell: (value: unknown) => <Badge variant="secondary">{String(value)}</Badge>
    },
    {
      key: 'points' as keyof ChemistryQuestion,
      header: 'Điểm',
      cell: (value: unknown) => <span className="font-mono">{Number(value)}</span>
    },
    {
      key: 'status' as keyof ChemistryQuestion,
      header: 'Trạng thái',
      cell: (value: unknown) => <StatusBadge status={String(value) as 'DRAFT' | 'PUBLISHED' | 'CLOSED'} />
    }
  ];

  const assignmentColumns = [
    {
      key: 'title' as keyof Assignment,
      header: 'Tiêu đề',
      cell: (value: unknown, row: Assignment) => (
        <div>
          <p className="font-medium">{String(value)}</p>
          <p className="text-sm text-muted-foreground truncate">{row.description}</p>
        </div>
      )
    },
    {
      key: 'dueDate' as keyof Assignment,
      header: 'Hạn nộp',
      cell: (value: unknown) => (
        <span className="text-sm">
          {(value as Date).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'questionsCount' as keyof Assignment,
      header: 'Số câu hỏi',
      cell: (value: unknown) => <Badge variant="outline">{Number(value)} câu</Badge>
    },
    {
      key: 'studentsCount' as keyof Assignment,
      header: 'Học sinh',
      cell: (value: unknown) => <span className="font-mono">{Number(value)}</span>
    },
    {
      key: 'averageScore' as keyof Assignment,
      header: 'Điểm TB',
      cell: (value?: unknown) => (
        <span className="font-mono">
          {value ? Number(value).toFixed(1) : '-'}
        </span>
      )
    },
    {
      key: 'status' as keyof Assignment,
      header: 'Trạng thái',
      cell: (value: unknown) => <StatusBadge status={String(value) as 'DRAFT' | 'PUBLISHED' | 'CLOSED'} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FlaskConical className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard Hóa học
                </h1>
                <p className="text-muted-foreground">
                  Quản lý câu hỏi và bài tập Hóa học
                </p>
              </div>
            </div>
            <SubjectBadge subject="CHEMISTRY" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng câu hỏi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-green-600">+12 tuần này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bài tập hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-blue-600">3 sắp hết hạn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Học sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">Tổng số học sinh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Điểm trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.3</div>
              <p className="text-xs text-green-600">+0.4 so với tháng trước</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="questions" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="questions">Ngân hàng câu hỏi</TabsTrigger>
              <TabsTrigger value="assignments">Bài tập</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>

          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ngân hàng câu hỏi Hóa học</CardTitle>
                  <Button onClick={() => setIsQuestionModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm câu hỏi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable<ChemistryQuestion>
                  data={mockQuestions}
                  columns={questionColumns}
                  searchable={false}
                  selectable
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bài tập Hóa học</CardTitle>
                  <Button onClick={() => setIsAssignmentModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo bài tập
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable<Assignment>
                  data={mockAssignments}
                  columns={assignmentColumns}
                  searchable={false}
                  selectable
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê Hóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tính năng thống kê sẽ được phát triển trong Phase 3
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title="Thêm câu hỏi Hóa học"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Câu hỏi <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows={3}
              placeholder="Nhập nội dung câu hỏi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Loại câu hỏi</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                <option value="CALCULATION">Tính toán</option>
                <option value="CHEMICAL_EQUATION">Phương trình hóa học</option>
                <option value="DIAGRAM">Sơ đồ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Độ khó</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="">Chọn chủ đề</option>
                <option value="Axit-Bazơ">Axit-Bazơ</option>
                <option value="Dung dịch">Dung dịch</option>
                <option value="Oxi hóa khử">Oxi hóa khử</option>
                <option value="Hóa hữu cơ">Hóa hữu cơ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Điểm</label>
              <Input type="number" min="1" max="10" defaultValue="2" />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsQuestionModalOpen(false)}
            >
              Hủy
            </Button>
            <Button>Lưu câu hỏi</Button>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title="Tạo bài tập Hóa học"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Nhập tiêu đề bài tập..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows={3}
              placeholder="Mô tả về bài tập..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hạn nộp</label>
              <Input type="datetime-local" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lớp</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="">Chọn lớp</option>
                <option value="10A1">10A1</option>
                <option value="10A2">10A2</option>
                <option value="11A1">11A1</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAssignmentModalOpen(false)}
            >
              Hủy
            </Button>
            <Button>Tạo bài tập</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}