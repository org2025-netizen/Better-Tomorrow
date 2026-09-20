import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { examsApi } from '@/api/exams.api';
import { Exam } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examSchema } from '@/utils/validation';
import { format } from 'date-fns';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(examSchema) });

  const fetchData = async () => {
    setLoading(true);
    try { const res = await examsApi.getAll({ page, limit: 10 }); setExams(res.data); setTotalPages(res.totalPages); } catch (err) { /* empty */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await examsApi.delete(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editExam) { await examsApi.update(editExam.id, data); toast.success('Updated'); }
      else { await examsApi.create(data); toast.success('Created'); }
      setShowModal(false); setEditExam(null); reset(); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const typeBadge = (type: string) => {
    const map: Record<string, any> = { midterm: 'info', endterm: 'primary', quiz: 'accent', assignment: 'warning', cat: 'success' };
    return <Badge variant={map[type] || 'gray'} size="sm">{type}</Badge>;
  };

  const columns = [
    { key: 'name', header: 'Exam Name', render: (e: Exam) => <span className="font-medium">{e.name}</span> },
    { key: 'type', header: 'Type', render: (e: Exam) => typeBadge(e.type) },
    { key: 'date', header: 'Date', render: (e: Exam) => format(new Date(e.date), 'MMM dd, yyyy') },
    { key: 'totalMarks', header: 'Total Marks' },
    { key: 'academicYear', header: 'Year' },
    { key: 'term', header: 'Term' },
    { key: 'actions', header: 'Actions', render: (e: Exam) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setEditExam(e); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(e.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Exams</h1><Button onClick={() => { setEditExam(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Exam</Button></div>
      <DataTable columns={columns} data={exams} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No exams found" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditExam(null); }} title={editExam ? 'Edit Exam' : 'Add Exam'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Exam Name" {...register('name')} error={errors.name?.message} defaultValue={editExam?.name} required />
            <Select label="Type" options={[{ value: 'midterm', label: 'Midterm' }, { value: 'endterm', label: 'End Term' }, { value: 'quiz', label: 'Quiz' }, { value: 'assignment', label: 'Assignment' }, { value: 'cat', label: 'CAT' }]} {...register('type')} error={errors.type?.message} required />
            <Input label="Class ID" {...register('classId')} error={errors.classId?.message} defaultValue={editExam?.classId} required />
            <Input label="Subject ID" {...register('subjectId')} error={errors.subjectId?.message} defaultValue={editExam?.subjectId} required />
            <Input label="Date" type="date" {...register('date')} error={errors.date?.message} defaultValue={editExam?.date?.split('T')[0]} required />
            <Input label="Start Time" type="time" {...register('startTime')} error={errors.startTime?.message} defaultValue={editExam?.startTime} required />
            <Input label="End Time" type="time" {...register('endTime')} error={errors.endTime?.message} defaultValue={editExam?.endTime} required />
            <Input label="Total Marks" type="number" {...register('totalMarks', { valueAsNumber: true })} error={errors.totalMarks?.message} defaultValue={editExam?.totalMarks} required />
            <Input label="Passing Marks" type="number" {...register('passingMarks', { valueAsNumber: true })} error={errors.passingMarks?.message} defaultValue={editExam?.passingMarks} required />
            <Input label="Academic Year" {...register('academicYear')} error={errors.academicYear?.message} defaultValue={editExam?.academicYear} required />
            <Input label="Term" {...register('term')} error={errors.term?.message} defaultValue={editExam?.term} required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editExam ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Exam" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
