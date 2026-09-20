import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { studentsApi } from '@/api/students.api';
import { Student } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ChildrenPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      studentsApi.getByParent(user.id).then((res) => {
        setChildren(Array.isArray(res) ? res : []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading children..." />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
      {children.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No children found linked to your account.</p></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => (
            <Card key={child.id} hover>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">{child.firstName?.[0]}{child.lastName?.[0]}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{child.firstName} {child.lastName}</h3>
                  <p className="text-sm text-gray-500 mb-2">{child.admissionNumber}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="info">{child.className?.name || 'N/A'}</Badge>
                    <Badge variant={child.gender === 'male' ? 'primary' : 'secondary'}>{child.gender}</Badge>
                    <Badge variant={child.isActive ? 'success' : 'danger'}>{child.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
