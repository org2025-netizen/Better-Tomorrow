import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { newsApi } from "@/api/news.api";
import { News } from "@/types";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Badge from "@/components/common/Badge";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema } from "@/utils/validation";

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<News | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(newsSchema) });

  const fetchData = async () => { setLoading(true); try { const res = await newsApi.getAll({ page, limit: 10 }); setItems(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => { if (!deleteId) return; try { await newsApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  const onSubmit = async (data: any) => {
    try { if (editItem) { await newsApi.update(editItem.id, data); toast.success("Updated"); } else { await newsApi.create(data); toast.success("Created"); } setShowModal(false); setEditItem(null); reset(); fetchData(); } catch(e) { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", header: "Title", render: (n: News) => <span className="font-medium line-clamp-1">{n.title}</span> },
    { key: "author", header: "Author" },
    { key: "isPublished", header: "Status", render: (n: News) => <Badge variant={n.isPublished ? "success" : "gray"} size="sm">{n.isPublished ? "Published" : "Draft"}</Badge> },
    { key: "actions", header: "Actions", render: (n: News) => (<div className="flex gap-2"><button onClick={() => { setEditItem(n); setShowModal(true); }} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => setDeleteId(n.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">News</h1><Button onClick={() => { setEditItem(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add News</Button></div>
      <DataTable columns={columns} data={items} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No news articles" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? "Edit News" : "Add News"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register("title")} error={errors.title?.message} defaultValue={editItem?.title} required />
          <Input label="Excerpt" {...register("excerpt")} error={errors.excerpt?.message} defaultValue={editItem?.excerpt} required />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea {...register("content")} rows={8} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary" /></div>
          {errors.content && <p className="text-sm text-red-500">{String(errors.content?.message || '')}</p>}
          <Input label="Featured Image URL" {...register("featuredImage")} defaultValue={editItem?.featuredImage} />
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>{editItem ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete News" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
