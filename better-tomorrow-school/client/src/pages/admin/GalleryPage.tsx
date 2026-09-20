import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { galleryApi } from "@/api/gallery.api";
import { GalleryItem } from "@/types";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  const fetchData = async () => { setLoading(true); try { const res = await galleryApi.getAll({ limit: 50 }); setItems(res.data); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: any) => {
    try { const fd = new FormData(); fd.append("title", data.title); fd.append("category", data.category); if (data.imageUrl) fd.append("imageUrl", data.imageUrl); await galleryApi.upload(fd); toast.success("Uploaded"); setShowModal(false); reset(); fetchData(); } catch(e) { toast.error("Failed"); }
  };

  const handleDelete = async () => { if (!deleteId) return; try { await galleryApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Gallery</h1><Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Upload Photo</Button></div>
      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => setDeleteId(item.id)} className="p-2 bg-red-500 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-gray-600 p-2 bg-white">{item.title}</p>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Photo">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register("title")} required />
          <Input label="Category" {...register("category")} required />
          <Input label="Image URL" {...register("imageUrl")} required />
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>Upload</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Photo" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
