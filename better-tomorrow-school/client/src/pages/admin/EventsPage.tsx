import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { eventsApi } from "@/api/events.api";
import { Event } from "@/types";
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
import { eventSchema } from "@/utils/validation";
import { format } from "date-fns";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(eventSchema) });

  const fetchData = async () => { setLoading(true); try { const res = await eventsApi.getAll({ page, limit: 10 }); setEvents(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => { if (!deleteId) return; try { await eventsApi.delete(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  const onSubmit = async (data: any) => {
    try { if (editEvent) { await eventsApi.update(editEvent.id, data); toast.success("Updated"); } else { await eventsApi.create(data); toast.success("Created"); } setShowModal(false); setEditEvent(null); reset(); fetchData(); } catch(e) { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", header: "Title", render: (e: Event) => <span className="font-medium">{e.title}</span> },
    { key: "category", header: "Category", render: (e: Event) => <Badge variant="primary" size="sm">{e.category}</Badge> },
    { key: "startDate", header: "Start", render: (e: Event) => format(new Date(e.startDate), "MMM dd, yyyy") },
    { key: "endDate", header: "End", render: (e: Event) => format(new Date(e.endDate), "MMM dd, yyyy") },
    { key: "actions", header: "Actions", render: (e: Event) => (<div className="flex gap-2"><button onClick={() => { setEditEvent(e); setShowModal(true); }} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => setDeleteId(e.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Events</h1><Button onClick={() => { setEditEvent(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Event</Button></div>
      <DataTable columns={columns} data={events} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No events" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditEvent(null); }} title={editEvent ? "Edit Event" : "Add Event"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" {...register("title")} error={errors.title?.message as string} defaultValue={editEvent?.title} required />
            <Select label="Category" options={[{ value: "academic", label: "Academic" }, { value: "cultural", label: "Cultural" }, { value: "sports", label: "Sports" }, { value: "social", label: "Social" }, { value: "holiday", label: "Holiday" }, { value: "other", label: "Other" }]} {...register("category")} error={errors.category?.message as string} required />
            <Input label="Start Date" type="datetime-local" {...register("startDate")} error={errors.startDate?.message as string} defaultValue={editEvent?.startDate?.slice(0, 16)} required />
            <Input label="End Date" type="datetime-local" {...register("endDate")} error={errors.endDate?.message as string} defaultValue={editEvent?.endDate?.slice(0, 16)} required />
            <Input label="Location" {...register("location")} defaultValue={editEvent?.location} />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea {...register("description")} rows={4} className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary" /></div>
          {errors.description && <p className="text-sm text-red-500">{String(errors.description?.message || '')}</p>}
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>{editEvent ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Event" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
