import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-red-600 dark:text-red-400 text-6xl mb-4">🚫</div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Truy cập bị từ chối
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            hoặc{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              đăng nhập lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}