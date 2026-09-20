import { useState, useEffect } from 'react';
import { admissionsApi } from '@/api/admissions.api';
import { AdmissionEnquiry } from '@/types';
import DataTable from '@/components/common/DataTable';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { exportToExcelWithHeaders } from '@/utils/exportExcel';

interface EnquiryRecord extends AdmissionEnquiry {
  learnerName?: string;
  gradeApplyingFor?: string;
}

export default function AdmissionsPage() {
  const [items, setItems] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 10 };
      if (status) params.status = status;
      const res = await admissionsApi.getAllEnquiries(params);
      setItems(res.data);
      setTotalPages(res.totalPages);
    } catch (e) { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, status]);

  const getChildName = (e: EnquiryRecord) => e.learnerName || e.childName;
  const getClassName = (e: EnquiryRecord) => e.gradeApplyingFor || e.classApplyingFor;

  const normalizeStatus = (s: string) => s?.toUpperCase();

  const statusBadge = (s: string) => {
    const upper = normalizeStatus(s);
    const colorMap: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'gray'> = {
      NEW: 'warning',
      PENDING: 'warning',
      CONTACTED: 'info',
      VISITED: 'primary',
      ENROLLED: 'success',
      DECLINED: 'danger',
    };
    const display = s?.toLowerCase() || 'pending';
    return <Badge variant={colorMap[upper] || 'gray'} size="sm">{display}</Badge>;
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await admissionsApi.updateEnquiryStatus(id, newStatus);
      fetchData();
    } catch (e) { /* empty */ }
  };

  const handleExport = () => {
    const headers: Record<string, string> = {
      childName: 'Child Name',
      parentName: 'Parent Name',
      parentPhone: 'Phone',
      classApplyingFor: 'Class Applying For',
      status: 'Status',
      createdAt: 'Date',
    };

    const exportData = items.map((e) => ({
      childName: getChildName(e),
      parentName: e.parentName,
      parentPhone: e.parentPhone,
      classApplyingFor: getClassName(e),
      status: e.status?.toLowerCase() || '',
      createdAt: format(new Date(e.createdAt), 'MMM dd, yyyy'),
    }));

    exportToExcelWithHeaders(exportData, headers, 'admission-enquiries');
  };

  const statusFilterOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'visited', label: 'Visited' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'declined', label: 'Declined' },
  ];

  const statusOptions = ['pending', 'contacted', 'visited', 'enrolled', 'declined'];

  const columns = [
    {
      key: 'childName',
      header: 'Child Name',
      render: (e: EnquiryRecord) => <span className="font-medium">{getChildName(e)}</span>,
    },
    { key: 'parentName', header: 'Parent Name' },
    { key: 'parentPhone', header: 'Phone' },
    {
      key: 'classApplyingFor',
      header: 'Class Applying For',
      render: (e: EnquiryRecord) => getClassName(e),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e: EnquiryRecord) => statusBadge(e.status),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (e: EnquiryRecord) => format(new Date(e.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (e: EnquiryRecord) => (
        <select
          value={e.status?.toLowerCase()}
          onChange={(ev) => handleStatusUpdate(e.id, ev.target.value)}
          className="text-xs border rounded px-2 py-1"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admission Enquiries</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>
      <div className="max-w-xs">
        <Select
          label="Filter by Status"
          options={statusFilterOptions}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        />
      </div>
      <DataTable
        columns={columns}
        data={items}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No admission enquiries found"
      />
    </div>
  );
}
