import { useState, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import { reportCardsApi } from '@/api/reportCards.api';
import { ReportCard } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ReportCardsPage() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [classId, setClassId] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await reportCardsApi.getAll({ page, limit: 10, classId, academicYear, term }); setReportCards(res.data); setTotalPages(res.totalPages); } catch (err) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page, classId, academicYear, term]);

  const handleGenerate = async () => {
    if (!classId || !academicYear || !term) { toast.error('Fill all fields'); return; }
    setGenerating(true);
    try { await reportCardsApi.generate({ classId, academicYear, term }); toast.success('Report cards generated'); fetchData(); } catch (err) { toast.error('Failed'); }
    setGenerating(false);
  };

  const columns = [
    { key: 'studentName', header: 'Student', render: (r: ReportCard) => <span className="font-medium">{r.student?.firstName} {r.student?.lastName}</span> },
    { key: 'className', header: 'Class', render: (r: ReportCard) => r.className?.name || '-' },
    { key: 'totalMarks', header: 'Total' },
    { key: 'averageMarks', header: 'Average', render: (r: ReportCard) => r.averageMarks?.toFixed(1) },
    { key: 'rank', header: 'Rank', render: (r: ReportCard) => r.rank ? <Badge variant="primary" size="sm">#{r.rank}</Badge> : '-' },
    { key: 'overallGrade', header: 'Grade', render: (r: ReportCard) => r.overallGrade ? <Badge variant="accent" size="sm">{r.overallGrade}</Badge> : '-' },
    { key: 'actions', header: 'Actions', render: (r: ReportCard) => (
      <Button variant="ghost" size="sm" onClick={() => reportCardsApi.downloadPdf(r.id).then((blob) => { const url = URL.createObjectURL(blob); window.open(url); })} icon={<Download className="w-4 h-4" />}>PDF</Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
      <Card>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Input label="Class ID" value={classId} onChange={(e) => setClassId(e.target.value)} placeholder="Class ID" />
          <Input label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g. 2026" />
          <Select label="Term" options={[{ value: '1', label: 'Term 1' }, { value: '2', label: 'Term 2' }, { value: '3', label: 'Term 3' }]} value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Select term" />
          <div className="flex items-end"><Button onClick={handleGenerate} loading={generating}>Generate</Button></div>
        </div>
      </Card>
      <DataTable columns={columns} data={reportCards} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No report cards found" />
    </div>
  );
}
