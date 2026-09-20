import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { announcementsApi } from '@/api/announcements.api';
import { Announcement } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function ParentAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementsApi.getActive('parents').then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading announcements..." />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      {items.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No announcements at this time.</p></Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><Bell className="w-5 h-5 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'gray'} size="sm">{item.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                  <p className="text-xs text-gray-400">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
