import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { parentsApi } from '@/api/parents.api';
import { Parent } from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parentSchema } from '@/utils/validation';
import { exportToExcelWithHeaders } from '@/utils/exportExcel';

type ParentFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  occupation: string;
  address: string;
};

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editParent, setEditParent] = useState<Parent | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
  });

  const fetchParents = async () => {
    setLoading(true);
    try {
      const res = await parentsApi.getAll({ page, limit: 10, search });
      setParents(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error('Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await parentsApi.delete(deleteId);
      toast.success('Parent deleted');
      setDeleteId(null);
      fetchParents();
    } catch {
      toast.error('Failed to delete parent');
    }
  };

  const onSubmit = async (data: ParentFormData) => {
    try {
      if (editParent) {
        await parentsApi.update(editParent.id, data);
        toast.success('Parent updated');
      } else {
        await parentsApi.create(data);
        toast.success('Parent created');
      }
      setShowModal(false);
      setEditParent(null);
      reset();
      fetchParents();
    } catch {
      toast.error('Failed to save parent');
    }
  };

  const handleExport = () => {
    exportToExcelWithHeaders(parents, {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      email: 'Email',
      relationship: 'Relationship',
      address: 'Address',
    }, 'parents');
  };

  const openCreate = () => {
    setEditParent(null);
    reset();
    setShowModal(true);
  };

  const openEdit = (parent: Parent) => {
    setEditParent(parent);
    reset({
      firstName: parent.firstName,
      lastName: parent.lastName,
      phone: parent.phone,
      email: parent.email,
      relationship: parent.relationship,
      occupation: parent.occupation,
      address: parent.address,
    });
    setShowModal(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: Parent) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-semibold">
            {row.firstName?.[0]}
            {row.lastName?.[0]}
          </div>
          <span>
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'relationship', header: 'Relationship' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Parent) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(row)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteId(row.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parents</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Parent
          </Button>
        </div>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search parents..."
      />

      <DataTable
        columns={columns}
        data={parents}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditParent(null);
          reset();
        }}
        title={editParent ? 'Edit Parent' : 'Add Parent'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Relationship"
              {...register('relationship')}
              error={errors.relationship?.message}
            />
            <Input
              label="Occupation"
              {...register('occupation')}
              error={errors.occupation?.message}
            />
          </div>
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditParent(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editParent ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Parent"
        message="Are you sure you want to delete this parent? This action cannot be undone."
      />
    </div>
  );
}
