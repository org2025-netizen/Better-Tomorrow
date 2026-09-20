import { useState, useEffect } from 'react';
import { Users, BookOpen, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/api/dashboard.api';
import Card from '@/components/common/Card';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dashboardApi.getTeacherStats(user.id).then(setStats).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const statCards = [
    { label: 'My Classes', value: stats?.classesCount || 0, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'My Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-green-500' },
    { label: 'My Subjects', value: stats?.subjectsCount || 0, icon: ClipboardList, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1><p className="text-gray-500 text-sm">Here is an overview of your teaching assignments.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p></div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-6 h-6 text-white" /></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
