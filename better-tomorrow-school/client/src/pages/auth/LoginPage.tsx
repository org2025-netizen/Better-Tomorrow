import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { schoolConfig } from '@/config/schoolConfig';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: any) => {
    try {
      const loggedInUser = await login(data.email, data.password);
      if (loggedInUser.role === 'parent') {
        navigate('/parent');
      } else if (loggedInUser.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/admin');
      }
    } catch (err) { /* handled by interceptor */ }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-primary-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src={schoolConfig.logoUrl} alt={schoolConfig.name} className="h-20 mx-auto mb-4 bg-white rounded-2xl p-2" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email Address" type="email" icon={<Mail className="w-4 h-4" />} {...register('email')} error={errors.email?.message} required />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} icon={<Lock className="w-4 h-4" />} {...register('password')} error={errors.password?.message} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-600">
              Register
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link to="/" className="text-primary hover:text-primary-600">Back to Website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
