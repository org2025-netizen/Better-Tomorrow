import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { teachersApi } from '@/api/teachers.api';
import { Teacher } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teacherSchema } from '@/utils/validation';
import { exportToExcelWithHeaders } from '@/utils/exportExcel';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(teacherSchema) });

  const fetchData = async () => {
    setLoading(true);
    try { const res = await teachersApi.getAll({ page, limit: 10, search }); setTeachers(res.data); setTotalPages(res.totalPages); } catch (err) { toast.error('Failed to load teachers'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await teachersApi.delete(deleteId); toast.success('Teacher deleted'); setDeleteId(null); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editTeacher) { await teachersApi.update(editTeacher.id, data); toast.success('Updated'); }
      else { await teachersApi.create(data); toast.success('Created'); }
      setShowModal(false); setEditTeacher(null); reset(); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const handleExport = () => {
    if (teachers.length === 0) { toast.error('No data to export'); return; }
    exportToExcelWithHeaders(teachers, {
      employeeId: 'Employee ID',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      email: 'Email',
      qualification: 'Qualification',
      specialization: 'Specialization',
      hireDate: 'Hire Date',
      status: 'Status',
    }, 'teachers');
    toast.success('Exported to Excel');
  };

  const columns = [
    { key: 'name', header: 'Name', render: (t: Teacher) => <div className="flex items-center gap-3"><div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">{t.firstName?.[0]}{t.lastName?.[0]}</div><span className="font-medium">{t.firstName} {t.lastName}</span></div> },
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'actions', header: 'Actions', render: (t: Teacher) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setEditTeacher(t); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>Export Excel</Button>
          <Button onClick={() => { setEditTeacher(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Teacher</Button>
        </div>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." className="w-80" />
      <DataTable columns={columns} data={teachers} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No teachers found" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditTeacher(null); }} title={editTeacher ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} defaultValue={editTeacher?.firstName} required />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} defaultValue={editTeacher?.lastName} required />
            <Input label="Phone" {...register('phone')} error={errors.phone?.message} defaultValue={editTeacher?.phone} required />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} defaultValue={editTeacher?.email} required />
            <Input label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} defaultValue={editTeacher?.employeeId} required />
            <Input label="Hire Date" type="date" {...register('hireDate')} error={errors.hireDate?.message} defaultValue={editTeacher?.hireDate?.split('T')[0]} required />
            <Input label="Qualification" {...register('qualification')} defaultValue={editTeacher?.qualification} />
            <Input label="Specialization" {...register('specialization')} defaultValue={editTeacher?.specialization} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editTeacher ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Teacher" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
