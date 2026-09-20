import { useState, useEffect } from 'react';
import { studentsApi } from '@/api/students.api';
import { useAuth } from '@/hooks/useAuth';
import { Student } from '@/types';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/common/Badge';

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getAll({ page, limit: 10 });
      setStudents(res.data);
      setTotalPages(res.totalPages);
    } catch (err) { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [page]);

  const columns = [
    { key: 'admissionNumber', header: 'Admission No', sortable: true },
    { key: 'name', header: 'Name', render: (s: Student) => <div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">{s.firstName?.[0]}{s.lastName?.[0]}</div><span className="font-medium">{s.firstName} {s.lastName}</span></div> },
    { key: 'className', header: 'Class', render: (s: Student) => s.className?.name || '-' },
    { key: 'gender', header: 'Gender', render: (s: Student) => <Badge variant={s.gender === 'male' ? 'info' : 'secondary'} size="sm">{s.gender}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">My Students</h1><p className="text-gray-500 text-sm">View students in your assigned classes.</p></div>
      <DataTable columns={columns} data={students} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No students found" />
    </div>
  );
}
