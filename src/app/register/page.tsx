import AuthLayout from '@/components/auth/AuthLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthGuard mode="guest" redirectTo="/">
      <AuthLayout 
        title="Đăng ký tài khoản" 
        subtitle="Tạo tài khoản ScienceEdu để bắt đầu hành trình học tập"
      >
        <RegisterForm />
      </AuthLayout>
    </AuthGuard>
  );
}