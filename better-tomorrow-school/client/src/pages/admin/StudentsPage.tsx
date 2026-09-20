import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import { studentsApi } from '@/api/students.api';
import { classesApi } from '@/api/classes.api';
import { parentsApi } from '@/api/parents.api';
import { Student, Class, Parent } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '@/utils/validation';
import { format } from 'date-fns';
import { exportToExcelWithHeaders } from '@/utils/exportExcel';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(studentSchema) });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getAll({ page, limit: 10, search });
      setStudents(res.data);
      setTotalPages(res.totalPages);
    } catch (err) { toast.error('Failed to load students'); }
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    try {
      const [classRes, parentRes] = await Promise.all([
        classesApi.getAll({ limit: 100 }),
        parentsApi.getAll({ limit: 100 }),
      ]);
      setClasses(classRes.data || []);
      setParents(parentRes.data || []);
    } catch (err) { /* empty */ }
  };

  useEffect(() => { fetchStudents(); }, [page, search]);
  useEffect(() => { fetchDropdowns(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await studentsApi.delete(deleteId);
      toast.success('Student deleted');
      setDeleteId(null);
      fetchStudents();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editStudent) {
        await studentsApi.update(editStudent.id, data);
        toast.success('Student updated');
      } else {
        await studentsApi.create(data);
        toast.success('Student created');
      }
      setShowModal(false);
      setEditStudent(null);
      reset();
      fetchStudents();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleExport = () => {
    if (students.length === 0) { toast.error('No data to export'); return; }
    exportToExcelWithHeaders(students, {
      admissionNumber: 'Admission No',
      firstName: 'First Name',
      lastName: 'Last Name',
      middleName: 'Middle Name',
      gender: 'Gender',
      dateOfBirth: 'Date of Birth',
      phone: 'Phone',
      address: 'Address',
      status: 'Status',
    }, 'students');
    toast.success('Exported to Excel');
  };

  const columns = [
    { key: 'admissionNumber', header: 'Adm No.', sortable: true },
    { key: 'name', header: 'Name', render: (s: Student) => <div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">{s.firstName?.[0]}{s.lastName?.[0]}</div><span className="font-medium">{s.firstName} {s.lastName}</span></div> },
    { key: 'className', header: 'Class', render: (s: Student) => s.className?.name || '-' },
    { key: 'gender', header: 'Gender', render: (s: Student) => <Badge variant={s.gender === 'male' ? 'info' : 'secondary'} size="sm">{s.gender}</Badge> },
    { key: 'dateOfBirth', header: 'DOB', render: (s: Student) => { try { return format(new Date(s.dateOfBirth), 'MMM dd, yyyy'); } catch { return '-'; } } },
    { key: 'actions', header: 'Actions', render: (s: Student) => (
      <div className="flex items-center gap-2">
        <Link to={`/admin/students/${s.id}`} className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></Link>
        <button onClick={() => { setEditStudent(s); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
        <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>Export Excel</Button>
          <Button onClick={() => { setEditStudent(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Student</Button>
        </div>
      </div>
      <div className="flex gap-4"><SearchInput value={search} onChange={setSearch} placeholder="Search students..." className="w-80" /></div>
      <DataTable columns={columns} data={students} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No students found" />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditStudent(null); }} title={editStudent ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} defaultValue={editStudent?.firstName} required />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} defaultValue={editStudent?.lastName} required />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} defaultValue={editStudent?.dateOfBirth?.split('T')[0]} required />
            <Select label="Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} {...register('gender')} error={errors.gender?.message} placeholder="Select gender" required />
            <Select label="Class" options={classes.map(c => ({ value: c.id, label: c.name }))} {...register('classId')} error={errors.classId?.message} placeholder="Select class" required />
            <Select label="Parent" options={parents.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))} {...register('parentId')} error={errors.parentId?.message} placeholder="Select parent" required />
          </div>
          <Input label="Address" {...register('address')} defaultValue={editStudent?.address} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editStudent ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Student" message="Are you sure you want to delete this student? This action cannot be undone." confirmLabel="Delete" />
    </div>
  );
}
