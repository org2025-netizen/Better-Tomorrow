import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { feesApi } from '@/api/fees.api';
import { studentsApi } from '@/api/students.api';
import { Student, Invoice } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';

export default function ParentFeesPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
      feesApi.getStudentInvoices(selectedChild).then(setInvoices).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedChild]);

  const statusColor = (s: string) => s === 'paid' ? 'success' : s === 'partial' ? 'warning' : s === 'overdue' ? 'danger' : 'info';

  const totalOutstanding = invoices.reduce((sum, i) => sum + i.balance, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Fees</h1>
      {children.length > 0 && (
        <div className="max-w-xs">
          <Select label="Select Child" options={children.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} />
        </div>
      )}
      {totalOutstanding > 0 && (
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Outstanding</p><p className="text-3xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</p></div></div></Card>
      )}
      {loading ? <LoadingSpinner text="Loading fees..." /> : invoices.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No invoices found.</p></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-4">Invoice</th><th className="text-left py-3 px-4">Amount</th><th className="text-left py-3 px-4">Paid</th><th className="text-left py-3 px-4">Balance</th><th className="text-left py-3 px-4">Status</th><th className="text-left py-3 px-4">Due Date</th></tr></thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">{formatCurrency(inv.amount)}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(inv.amountPaid)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(inv.balance)}</td>
                    <td className="py-3 px-4"><Badge variant={statusColor(inv.status)} size="sm">{inv.status}</Badge></td>
                    <td className="py-3 px-4">{format(new Date(inv.dueDate), 'MMM dd, yyyy')}</td>
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
