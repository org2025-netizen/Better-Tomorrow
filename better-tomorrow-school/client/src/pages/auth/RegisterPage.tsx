import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Shield, GraduationCap, Briefcase, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import toast from 'react-hot-toast';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';

const roles = [
  { value: 'PARENT', label: 'Parent', icon: UserPlus, description: 'Register as a parent/guardian' },
  { value: 'TEACHER', label: 'Teacher', icon: GraduationCap, description: 'Register as a teacher/educator' },
  { value: 'ADMIN', label: 'Admin', icon: Shield, description: 'Register as an administrator' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('PARENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authApi.register({
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
      });
      toast.success('Registration submitted! Waiting for admin approval.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="block text-center">
          <svg className="mx-auto h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose your role and register. Admin approval required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Register as</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(role => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon className={`w-6 h-6 ${selectedRole === role.value ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="mt-2 text-sm font-medium">{role.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">{role.description}</span>
                    </div>
                    {selectedRole === role.value && (
                      <CheckCircle className="absolute top-2 right-2 text-primary w-5 h-5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="John Doe"
              icon={<User className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="+254 7XX XXX XXX"
              icon={<Phone className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Admin approval required</p>
                  <p>Your account will be reviewed by an administrator. You'll receive an email once approved.</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}