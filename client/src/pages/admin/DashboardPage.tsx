import { useState, useEffect } from 'react';
import { Users, GraduationCap, UserCheck, BookOpen, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardApi } from '@/api/dashboard.api';
import Card from '@/components/common/Card';
import { formatCurrency } from '@/utils/format';

const COLORS = ['#0B2A5B', '#D71920', '#D4AF37', '#10B981', '#6366F1'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdminStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-blue-500' },
    { label: 'Total Parents', value: stats.totalParents, icon: Users, color: 'bg-green-500' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: UserCheck, color: 'bg-purple-500' },
    { label: 'Total Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-orange-500' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Pending Invoices', value: stats.overdueInvoices || 0, icon: AlertCircle, color: 'bg-red-500' },
  ] : [];

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500 text-sm">Welcome back! Here is an overview.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p></div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-6 h-6 text-white" /></div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#0B2A5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Class</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.studentDistribution || []} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="className" label={({ className, count }) => `${className}: ${count}`}>
                  {(stats?.studentDistribution || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
          <div className="space-y-3">
            {(stats?.recentEnrollments || []).slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">{s.firstName?.[0]}{s.lastName?.[0]}</div>
                <div className="flex-1"><p className="text-sm font-medium">{s.firstName} {s.lastName}</p><p className="text-xs text-gray-500">{s.admissionNumber}</p></div>
              </div>
            ))}
            {(!stats?.recentEnrollments || stats.recentEnrollments.length === 0) && <p className="text-sm text-gray-500 text-center py-4">No recent enrollments</p>}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {(stats?.recentPayments || []).slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold"><DollarSign className="w-4 h-4" /></div>
                <div className="flex-1"><p className="text-sm font-medium">{p.receiptNumber || 'Payment'}</p><p className="text-xs text-gray-500">{formatCurrency(p.amount)}</p></div>
              </div>
            ))}
            {(!stats?.recentPayments || stats.recentPayments.length === 0) && <p className="text-sm text-gray-500 text-center py-4">No recent payments</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
