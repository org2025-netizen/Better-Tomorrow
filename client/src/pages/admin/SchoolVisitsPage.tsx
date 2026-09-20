import { useState, useEffect } from 'react';
import { admissionsApi } from '@/api/admissions.api';
import { SchoolVisit } from '@/types';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/common/Badge';
import { format } from 'date-fns';

export default function SchoolVisitsPage() {
  const [items, setItems] = useState<SchoolVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await admissionsApi.getAllVisits({ page, limit: 10 }); setItems(res.data); setTotalPages(res.totalPages); } catch (e) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page]);

  const updateStatus = async (id: string, s: string) => { try { await admissionsApi.updateVisitStatus(id, s); fetchData(); } catch (e) { /* empty */ } };

  const columns = [
    { key: 'parentName', header: 'Parent', render: (v: SchoolVisit) => <span className="font-medium">{v.parentName}</span> },
    { key: 'parentPhone', header: 'Phone' },
    { key: 'visitDate', header: 'Date', render: (v: SchoolVisit) => format(new Date(v.visitDate), 'MMM dd, yyyy') },
    { key: 'visitTime', header: 'Time' },
    { key: 'numberOfChildren', header: 'Children' },
    { key: 'status', header: 'Status', render: (v: SchoolVisit) => <Badge variant={v.status === 'confirmed' ? 'success' : v.status === 'completed' ? 'info' : v.status === 'cancelled' ? 'danger' : 'warning'} size="sm">{v.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (v: SchoolVisit) => (
      <select value={v.status} onChange={(e) => updateStatus(v.id, e.target.value)} className="text-xs border rounded px-2 py-1">
        {['pending', 'confirmed', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School Visits</h1>
      <DataTable columns={columns} data={items} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No visits" />
    </div>
  );
}
