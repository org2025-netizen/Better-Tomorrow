import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { feesApi } from "@/api/fees.api";
import { FeeStructure } from "@/types";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import { formatCurrency } from "@/utils/format";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feeStructureSchema } from "@/utils/validation";
import { format } from "date-fns";

export default function FeeStructurePage() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editFee, setEditFee] = useState<FeeStructure | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(feeStructureSchema) });

  const fetchData = async () => { setLoading(true); try { const res = await feesApi.getStructures({ page, limit: 10 }); setFees(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async () => { if (!deleteId) return; try { await feesApi.deleteStructure(deleteId); toast.success("Deleted"); setDeleteId(null); fetchData(); } catch(e) { toast.error("Failed"); } };

  const onSubmit = async (data: any) => {
    try { if (editFee) { await feesApi.updateStructure(editFee.id, data); toast.success("Updated"); } else { await feesApi.createStructure(data); toast.success("Created"); } setShowModal(false); setEditFee(null); reset(); fetchData(); } catch(e) { toast.error("Failed"); }
  };

  const columns = [
    { key: "name", header: "Fee Name", render: (f: FeeStructure) => <span className="font-medium">{f.name}</span> },
    { key: "classLevel", header: "Level" },
    { key: "amount", header: "Amount", render: (f: FeeStructure) => formatCurrency(f.amount) },
    { key: "academicYear", header: "Year" },
    { key: "term", header: "Term" },
    { key: "actions", header: "Actions", render: (f: FeeStructure) => (<div className="flex gap-2"><button onClick={() => { setEditFee(f); setShowModal(true); }} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => setDeleteId(f.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Fee Structure</h1><Button onClick={() => { setEditFee(null); reset(); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Fee</Button></div>
      <DataTable columns={columns} data={fees} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No fee structures" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditFee(null); }} title={editFee ? "Edit Fee" : "Add Fee"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Fee Name" {...register("name")} error={errors.name?.message} defaultValue={editFee?.name} required />
            <Input label="Class Level" {...register("classLevel")} error={errors.classLevel?.message} defaultValue={editFee?.classLevel} required />
            <Input label="Amount" type="number" {...register("amount", { valueAsNumber: true })} error={errors.amount?.message} defaultValue={editFee?.amount} required />
            <Input label="Academic Year" {...register("academicYear")} error={errors.academicYear?.message} defaultValue={editFee?.academicYear} required />
            <Input label="Term" {...register("term")} error={errors.term?.message} defaultValue={editFee?.term} required />
            <Input label="Due Date" type="date" {...register("dueDate")} error={errors.dueDate?.message} defaultValue={editFee?.dueDate?.split("T")[0]} required />
          </div>
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>{editFee ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Fee" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
