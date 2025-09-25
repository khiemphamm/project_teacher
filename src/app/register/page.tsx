import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Đăng ký tài khoản" 
      subtitle="Tạo tài khoản ScienceEdu để bắt đầu hành trình học tập"
    >
      <RegisterForm />
    </AuthLayout>
  );
}