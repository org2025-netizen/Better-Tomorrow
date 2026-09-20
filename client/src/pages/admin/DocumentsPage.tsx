import { useState, useEffect } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { documentsApi } from "@/api/documents.api";
import { Document } from "@/types";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  const fetchData = async () => { setLoading(true); try { const res = await documentsApi.getAll({ page, limit: 10 }); setDocs(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const onSubmit = async (data: any) => { try { const fd = new FormData(); fd.append("title", data.title); fd.append("category", data.category); fd.append("fileUrl", data.fileUrl); fd.append("fileType", "pdf"); fd.append("fileSize", "0"); await documentsApi.upload(fd); toast.success("Uploaded"); setShowModal(false); reset(); fetchData(); } catch(e) { toast.error("Failed"); } };
  const handleDelete = async () => { if (!deleteId) return; try { await documentsApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  const columns = [
    { key: "title", header: "Title", render: (d: Document) => <span className="font-medium">{d.title}</span> },
    { key: "category", header: "Category" },
    { key: "fileType", header: "Type" },
    { key: "actions", header: "Actions", render: (d: Document) => (<div className="flex gap-2"><button onClick={() => setDeleteId(d.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Documents</h1><Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Upload Document</Button></div>
      <DataTable columns={columns} data={docs} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No documents" />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Document">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register("title")} required />
          <Input label="Category" {...register("category")} required />
          <Input label="File URL" {...register("fileUrl")} required />
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>Upload</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Document" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
