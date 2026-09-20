import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { reportCardsApi } from '@/api/reportCards.api';
import { studentsApi } from '@/api/students.api';
import { Student, ReportCard } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ParentResultsPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [results, setResults] = useState<ReportCard[]>([]);
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
      reportCardsApi.getByStudent(selectedChild).then(setResults).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedChild]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
      {children.length > 0 && (
        <div className="max-w-xs">
          <Select label="Select Child" options={children.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} />
        </div>
      )}
      {loading ? <LoadingSpinner text="Loading results..." /> : results.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No results found.</p></Card>
      ) : (
        <div className="space-y-4">
          {results.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <div><h3 className="font-semibold text-gray-900">{r.academicYear} - Term {r.term}</h3><p className="text-sm text-gray-500">{r.className?.name}</p></div>
                <div className="flex gap-4 text-center">
                  <div><p className="text-2xl font-bold text-primary">{r.averageMarks?.toFixed(1)}</p><p className="text-xs text-gray-500">Average</p></div>
                  {r.rank && <div><p className="text-2xl font-bold text-accent">#{r.rank}</p><p className="text-xs text-gray-500">Rank</p></div>}
                  {r.overallGrade && <div><Badge variant="accent" size="md">{r.overallGrade}</Badge><p className="text-xs text-gray-500 mt-1">Grade</p></div>}
                </div>
              </div>
              {r.teacherRemarks && <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg"><strong>Teacher:</strong> {r.teacherRemarks}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
