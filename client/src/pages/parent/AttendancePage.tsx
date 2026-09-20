import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { attendanceApi } from '@/api/attendance.api';
import { studentsApi } from '@/api/students.api';
import { Student } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function ParentAttendancePage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      studentsApi.getByParent(user.id).then((res) => {
        const list = Array.isArray(res) ? res : [];
        setChildren(list);
        if (list.length > 0) setSelectedChild(list[0].id);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      setLoading(true);
      attendanceApi.getStudentAttendance(selectedChild).then(setAttendance).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedChild]);

  const statusColor = (s: string) => s === 'present' ? 'success' : s === 'absent' ? 'danger' : s === 'late' ? 'warning' : 'info';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
      {children.length > 0 && (
        <div className="max-w-xs">
          <Select label="Select Child" options={children.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} />
        </div>
      )}
      {loading ? <LoadingSpinner text="Loading attendance..." /> : attendance.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No attendance records found.</p></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-4">Date</th><th className="text-left py-3 px-4">Status</th><th className="text-left py-3 px-4">Remarks</th></tr></thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">{format(new Date(a.date), 'MMM dd, yyyy')}</td>
                    <td className="py-3 px-4"><Badge variant={statusColor(a.status)} size="sm">{a.status}</Badge></td>
                    <td className="py-3 px-4 text-gray-500">{a.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
