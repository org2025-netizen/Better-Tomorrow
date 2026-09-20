import { useState, useEffect } from 'react';
import { dashboardApi } from '@/api/dashboard.api';
import { AuditLog } from '@/types';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/common/Badge';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await dashboardApi.getAuditLogs({ page, limit: 10 }); setLogs(res.data || []); setTotalPages(res.totalPages || 1); } catch (e) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page]);

  const columns = [
    { key: 'user', header: 'User', render: (l: AuditLog) => <span className="font-medium">{l.user?.firstName} {l.user?.lastName}</span> },
    { key: 'action', header: 'Action', render: (l: AuditLog) => <Badge variant="primary" size="sm">{l.action}</Badge> },
    { key: 'entity', header: 'Entity', render: (l: AuditLog) => <Badge variant="gray" size="sm">{l.entity}</Badge> },
    { key: 'entityId', header: 'Entity ID', render: (l: AuditLog) => <span className="text-xs text-gray-500">{l.entityId?.slice(0, 8)}...</span> },
    { key: 'createdAt', header: 'Date', render: (l: AuditLog) => format(new Date(l.createdAt), 'MMM dd, yyyy HH:mm') },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <DataTable columns={columns} data={logs} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No audit logs" />
    </div>
  );
}
