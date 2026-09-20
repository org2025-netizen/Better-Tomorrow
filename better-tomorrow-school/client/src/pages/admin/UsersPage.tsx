import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { User } from '@/types';
import client from '@/api/client';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => { setLoading(true); try { const { data } = await client.get('/users', { params: { page, limit: 10 } }); setUsers(data.data || []); setTotalPages(data.totalPages || 1); } catch (e) { /* empty */ } setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);
    try {
      if (editUser) { await client.put(`/users/${editUser.id}`, data); toast.success('Updated'); }
      else { await client.post('/users', data); toast.success('Created'); }
      setShowModal(false); setEditUser(null); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async () => { if (!deleteId) return; try { await client.delete(`/users/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetchData(); } catch (e) { toast.error('Failed'); } };

  const columns = [
    { key: 'name', header: 'Name', render: (u: User) => <span className="font-medium">{u.firstName} {u.lastName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u: User) => <Badge variant={u.role === 'admin' ? 'primary' : u.role === 'teacher' ? 'info' : 'success'} size="sm">{u.role}</Badge> },
    { key: 'isActive', header: 'Status', render: (u: User) => <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">{u.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', header: 'Actions', render: (u: User) => (
      <div className="flex gap-2">
        <button onClick={() => { setEditUser(u); setShowModal(true); }} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(u.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Users</h1><Button onClick={() => { setEditUser(null); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add User</Button></div>
      <DataTable columns={columns} data={users} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No users" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditUser(null); }} title={editUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" defaultValue={editUser?.firstName} required />
            <Input label="Last Name" name="lastName" defaultValue={editUser?.lastName} required />
            <Input label="Email" type="email" name="email" defaultValue={editUser?.email} required />
            {!editUser && <Input label="Password" type="password" name="password" required />}
            <Select label="Role" name="role" options={[{ value: 'admin', label: 'Admin' }, { value: 'teacher', label: 'Teacher' }, { value: 'parent', label: 'Parent' }]} defaultValue={editUser?.role} required />
          </div>
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit">{editUser ? 'Update' : 'Create'}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete User" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
