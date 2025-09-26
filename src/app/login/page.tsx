import AuthLayout from '@/components/auth/AuthLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import LoginForm from '@/components/auth/LoginForm';

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  
  return (
    <AuthGuard mode="guest" redirectTo={callbackUrl || '/'}>
      <AuthLayout 
        title="Đăng nhập" 
        subtitle="Đăng nhập vào tài khoản ScienceEdu của bạn"
      >
        <LoginForm callbackUrl={callbackUrl} />
      </AuthLayout>
    </AuthGuard>
  );
}