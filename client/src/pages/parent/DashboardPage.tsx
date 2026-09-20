import { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/api/dashboard.api';
import Card from '@/components/common/Card';
import { formatCurrency } from '@/utils/format';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dashboardApi.getParentStats(user.id).then(setStats).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const statCards = [
    { label: 'My Children', value: stats?.childrenCount || 0, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Outstanding Fees', value: formatCurrency(stats?.outstandingFees || 0), icon: CreditCard, color: 'bg-red-500' },
    { label: 'Announcements', value: stats?.announcementsCount || 0, icon: Bell, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1><p className="text-gray-500 text-sm">Here is an overview of your children's progress.</p></div>
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
      {stats?.children?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">My Children</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.children.map((child: any) => (
              <Card key={child.id} hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">{child.firstName?.[0]}{child.lastName?.[0]}</div>
                  <div><p className="font-semibold text-gray-900">{child.firstName} {child.lastName}</p><p className="text-sm text-gray-500">{child.className?.name || 'N/A'} | {child.admissionNumber}</p></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
