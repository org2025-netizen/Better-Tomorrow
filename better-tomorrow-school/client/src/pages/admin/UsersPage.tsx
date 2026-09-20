import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, UserCheck, UserX, UserMinus, MoreHorizontal, Mail, Phone, Shield, GraduationCap, UserPlus as UserPlusIcon, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import toast from 'react-hot-toast';
import DataTable from '@/components/common/DataTable';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';

const statusVariants: Record<string, 'warning' | 'success' | 'danger' | 'gray'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

const roleVariants: Record<string, 'primary' | 'secondary' | 'accent' | 'danger' | 'info' | 'gray'> = {
  parent: 'primary',
  teacher: 'accent',
  admin: 'danger',
  super_admin: 'info',
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({ role: roleFilter, status: statusFilter });
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleApprove = async (userId: string) => {
    try {
      await adminApi.approveUser(userId);
      toast.success('User approved successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await adminApi.rejectUser(userId, rejectReason);
      toast.success('User rejected');
      fetchUsers();
      setShowRejectModal(null);
      setRejectReason('');
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await adminApi.toggleUserStatus(userId, !isActive);
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { key: 'name', header: 'Name', render: (user: any) => (
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
      </div>
    )},
    { key: 'role', header: 'Role', render: (user: any) => (
      <Badge variant={roleVariants[user.role] || 'gray'}>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
      </Badge>
    )},
    { key: 'status', header: 'Status', render: (user: any) => (
      <Badge variant={statusVariants[user.status] || 'gray'}>
        {user.status}
      </Badge>
    )},
    { key: 'isActive', header: 'Active', render: (user: any) => (
      <Badge variant={user.isActive ? 'success' : 'danger'}>
        {user.isActive ? 'Yes' : 'No'}
      </Badge>
    )},
    { key: 'lastLogin', header: 'Last Login', render: (user: any) => (
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
    )},
    { key: 'createdAt', header: 'Registered', render: (user: any) => (
      new Date(user.createdAt).toLocaleDateString()
    )},
    { key: 'actions', header: 'Actions', render: (user: any) => (
      <div className="flex items-center gap-2">
        {user.status === 'PENDING' && (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleApprove(user.id)}
              icon={<UserCheck className="w-4 h-4" />}
              className="w-8 h-8 p-0"
              title="Approve"
            />
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowRejectModal(user.id)}
              icon={<UserX className="w-4 h-4" />}
              className="w-8 h-8 p-0"
              title="Reject"
            />
          </>
        )}
        {user.status === 'APPROVED' && (
          <Button
            size="sm"
            variant={user.isActive ? 'danger' : 'primary'}
            onClick={() => handleToggleStatus(user.id, user.isActive)}
            icon={user.isActive ? <UserMinus className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
            className="w-8 h-8 p-0"
            title={user.isActive ? 'Deactivate' : 'Activate'}
          />
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage teachers, parents, and admins</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={roleFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'PARENT', label: 'Parents' },
              { value: 'TEACHER', label: 'Teachers' },
              { value: 'ADMIN', label: 'Admins' },
            ]}
            className="w-40"
            placeholder="All Roles"
          />
          <Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
            className="w-40"
            placeholder="All Status"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          emptyMessage="No users found"
          page={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={!!showRejectModal}
        onClose={() => setShowRejectModal(null)}
        title="Reject User"
        size="md"
      >
        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this user:</p>
        <textarea
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px] resize-y"
          rows={4}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setShowRejectModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => showRejectModal && handleReject(showRejectModal)} loading={loading}>
            Reject
          </Button>
        </div>
      </Modal>
    </div>
  );
}