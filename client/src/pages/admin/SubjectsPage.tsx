import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { subjectsApi } from '@/api/subjects.api';
import { Subject } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema } from '@/utils/validation';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(subjectSchema) });

  const fetchData = async () => {
    setLoading(true);
    try { const res = await subjectsApi.getAll({ page, limit: 10, search }); setSubjects(res.data); setTotalPages(res.totalPages); } catch (err) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await subjectsApi.delete(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editSubject) { await subjectsApi.update(editSubject.id, data); toast.success('Updated'); }
      else { await subjectsApi.create(data); toast.success('Created'); }
      setShowModal(false); setEditSubject(null); reset(); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Subject Name', render: (s: Subject) => <span className="font-medium">{s.name}</span> },
    { key: 'classLevel', header: 'Class Level' },
    { key: 'actions', header: 'Actions', render: (s: Subject) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setEditSubject(s); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Subjects</h1><Button onClick={() => { setEditSubject(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Subject</Button></div>
      <SearchInput value={search} onChange={setSearch} placeholder="Search subjects..." className="w-80" />
      <DataTable columns={columns} data={subjects} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No subjects found" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditSubject(null); }} title={editSubject ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Subject Name" {...register('name')} error={errors.name?.message} defaultValue={editSubject?.name} required />
            <Input label="Subject Code" {...register('code')} error={errors.code?.message} defaultValue={editSubject?.code} required />
            <Input label="Class Level" {...register('classLevel')} error={errors.classLevel?.message} defaultValue={editSubject?.classLevel} required />
          </div>
          <Input label="Description" {...register('description')} defaultValue={editSubject?.description} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editSubject ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Subject" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
