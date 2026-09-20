import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { announcementsApi } from "@/api/announcements.api";
import { Announcement } from "@/types";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Badge from "@/components/common/Badge";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/utils/validation";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(announcementSchema) });

  const fetchData = async () => { setLoading(true); try { const res = await announcementsApi.getAll({ page, limit: 10 }); setItems(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => { if (!deleteId) return; try { await announcementsApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  const onSubmit = async (data: any) => {
    try { if (editItem) { await announcementsApi.update(editItem.id, data); toast.success("Updated"); } else { await announcementsApi.create(data); toast.success("Created"); } setShowModal(false); setEditItem(null); reset(); fetchData(); } catch(e) { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", header: "Title", render: (a: Announcement) => <span className="font-medium">{a.title}</span> },
    { key: "target", header: "Target", render: (a: Announcement) => <Badge variant="info" size="sm">{a.target}</Badge> },
    { key: "priority", header: "Priority", render: (a: Announcement) => <Badge variant={a.priority === "high" ? "danger" : a.priority === "medium" ? "warning" : "gray"} size="sm">{a.priority}</Badge> },
    { key: "actions", header: "Actions", render: (a: Announcement) => (<div className="flex gap-2"><button onClick={() => { setEditItem(a); setShowModal(true); }} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => setDeleteId(a.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Announcements</h1><Button onClick={() => { setEditItem(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Announcement</Button></div>
      <DataTable columns={columns} data={items} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No announcements" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? "Edit Announcement" : "Add Announcement"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register("title")} error={errors.title?.message} defaultValue={editItem?.title} required />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea {...register("content")} rows={4} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary" /></div>
          {errors.content && <p className="text-sm text-red-500">{String(errors.content?.message || '')}</p>}
          <Select label="Target" options={[{ value: "all", label: "All" }, { value: "parents", label: "Parents" }, { value: "teachers", label: "Teachers" }, { value: "students", label: "Students" }]} {...register("target")} error={errors.target?.message as string} required />
          <Select label="Priority" options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} {...register("priority")} error={errors.priority?.message} required />
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>{editItem ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Announcement" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
