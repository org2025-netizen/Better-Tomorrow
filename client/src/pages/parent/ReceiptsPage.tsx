import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { receiptsApi } from '@/api/receipts.api';
import { studentsApi } from '@/api/students.api';
import { Student, Receipt } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';

export default function ParentReceiptsPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
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
      receiptsApi.getByStudent(selectedChild).then(setReceipts).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedChild]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
      {children.length > 0 && (
        <div className="max-w-xs">
          <Select label="Select Child" options={children.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} />
        </div>
      )}
      {loading ? <LoadingSpinner text="Loading receipts..." /> : receipts.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No receipts found.</p></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-4">Receipt No.</th><th className="text-left py-3 px-4">Description</th><th className="text-left py-3 px-4">Amount</th><th className="text-left py-3 px-4">Date</th></tr></thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{r.receiptNumber}</td>
                    <td className="py-3 px-4">{r.description}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{formatCurrency(r.amount)}</td>
                    <td className="py-3 px-4">{format(new Date(r.issuedAt), 'MMM dd, yyyy')}</td>
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
