import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import { contactApi } from '@/api/contact.api';
import { ContactMessage } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => { setLoading(true); try { const res = await contactApi.getAll({ page, limit: 10 }); setMessages(res.data); setTotalPages(res.totalPages); } catch (e) { /* empty */ } setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const markRead = async (id: string) => { try { await contactApi.markAsRead(id); fetchData(); } catch (e) { /* empty */ } };
  const handleDelete = async () => { if (!deleteId) return; try { await contactApi.delete(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData(); } catch (e) { toast.error('Failed'); } };

  const columns = [
    { key: 'name', header: 'Name', render: (m: ContactMessage) => <span className={`font-medium ${!m.isRead ? 'text-primary' : ''}`}>{m.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'subject', header: 'Subject' },
    { key: 'createdAt', header: 'Date', render: (m: ContactMessage) => format(new Date(m.createdAt), 'MMM dd, yyyy') },
    { key: 'isRead', header: 'Status', render: (m: ContactMessage) => m.isRead ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-primary" /> },
    { key: 'actions', header: 'Actions', render: (m: ContactMessage) => (
      <div className="flex gap-2">
        <button onClick={() => { setSelected(m); if (!m.isRead) markRead(m.id); }} className="p-1.5 hover:text-primary hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(m.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <DataTable columns={columns} data={messages} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No messages" />
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.subject} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>From: <strong className="text-gray-900">{selected.name}</strong></span>
              <span>{selected.email}</span>
              {selected.phone && <span>{selected.phone}</span>}
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{selected.message}</p>
          </div>
        </Modal>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Message" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
