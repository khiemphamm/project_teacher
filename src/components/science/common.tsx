import { Atom, BookOpen, FlaskConical, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SubjectIconProps {
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  className?: string;
  size?: number;
}

export function SubjectIcon({ subject, className, size = 20 }: SubjectIconProps) {
  const iconProps = {
    size,
    className: cn("text-current", className)
  };

  switch (subject) {
    case 'BIOLOGY':
      return <BookOpen {...iconProps} />;
    case 'CHEMISTRY':
      return <FlaskConical {...iconProps} />;
    case 'PHYSICS':
      return <Zap {...iconProps} />;
    default:
      return <Atom {...iconProps} />;
  }
}

export interface SubjectBadgeProps {
  subject: 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS';
  className?: string;
  showIcon?: boolean;
}

export function SubjectBadge({ subject, className, showIcon = true }: SubjectBadgeProps) {
  const subjectConfig = {
    BIOLOGY: {
      label: 'Sinh học',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: BookOpen
    },
    CHEMISTRY: {
      label: 'Hóa học',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: FlaskConical
    },
    PHYSICS: {
      label: 'Vật lý',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: Zap
    }
  };

  const config = subjectConfig[subject];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border",
        config.color,
        className
      )}
    >
      {showIcon && <Icon size={12} />}
      {config.label}
    </Badge>
  );
}

export interface DifficultyBadgeProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const difficultyConfig = {
    EASY: {
      label: 'Dễ',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    MEDIUM: {
      label: 'Trung bình',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    },
    HARD: {
      label: 'Khó',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  };

  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full border",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

export interface StatusBadgeProps {
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    DRAFT: {
      label: 'Nháp',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    },
    PUBLISHED: {
      label: 'Đã xuất bản',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    CLOSED: {
      label: 'Đã đóng',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full border",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}