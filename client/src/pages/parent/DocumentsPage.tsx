import { useState, useEffect } from 'react';
import { FolderOpen, Download } from 'lucide-react';
import { documentsApi } from '@/api/documents.api';
import { Document } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function ParentDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentsApi.getAll({ target: 'parents', limit: 50 }).then((res) => setDocs(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await documentsApi.download(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title;
      a.click();
    } catch (e) { /* empty */ }
  };

  if (loading) return <LoadingSpinner text="Loading documents..." />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      {docs.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No documents available.</p></Card>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><FolderOpen className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.category} | {format(new Date(doc.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <button onClick={() => handleDownload(doc)} className="p-2 text-primary hover:bg-primary-50 rounded-lg"><Download className="w-5 h-5" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
