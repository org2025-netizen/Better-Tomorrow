import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { classesApi } from '@/api/classes.api';
import { Class } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classSchema } from '@/utils/validation';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(classSchema) });

  const fetchData = async () => {
    setLoading(true);
    try { const res = await classesApi.getAll({ page, limit: 10 }); setClasses(res.data); setTotalPages(res.totalPages); } catch (err) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await classesApi.delete(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editClass) { await classesApi.update(editClass.id, data); toast.success('Updated'); }
      else { await classesApi.create(data); toast.success('Created'); }
      setShowModal(false); setEditClass(null); reset(); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const columns = [
    { key: 'name', header: 'Class Name', render: (c: Class) => <span className="font-medium">{c.name}</span> },
    { key: 'capacity', header: 'Capacity', render: (c: Class) => <span>{c.capacity || 40}</span> },
    { key: 'actions', header: 'Actions', render: (c: Class) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setEditClass(c); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Classes</h1><Button onClick={() => { setEditClass(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Class</Button></div>
      <DataTable columns={columns} data={classes} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No classes found" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditClass(null); }} title={editClass ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Class Name" {...register('name')} error={errors.name?.message} defaultValue={editClass?.name} required />
            <Input label="Section" {...register('section')} defaultValue={editClass?.section} />
            <Input label="Level" {...register('level')} error={errors.level?.message} defaultValue={editClass?.level} required />
            <Input label="Capacity" type="number" {...register('capacity', { valueAsNumber: true })} error={errors.capacity?.message} defaultValue={editClass?.capacity} required />
            <Input label="Academic Year" {...register('academicYear')} error={errors.academicYear?.message} defaultValue={editClass?.academicYear} required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editClass ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Class" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
