import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import { paymentsApi } from "@/api/payments.api";
import { Payment } from "@/types";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Badge from "@/components/common/Badge";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  const fetchData = async () => { setLoading(true); try { const res = await paymentsApi.getAll({ page, limit: 10 }); setPayments(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const onSubmit = async (data: any) => { try { await paymentsApi.create(data); toast.success("Payment recorded"); setShowModal(false); reset(); fetchData(); } catch(e) { toast.error("Failed"); } };

  const columns = [
    { key: "receiptNumber", header: "Receipt No.", render: (p: Payment) => <span className="font-medium">{p.receiptNumber}</span> },
    { key: "studentName", header: "Student", render: (p: Payment) => `${p.student?.firstName || ""} ${p.student?.lastName || ""}` },
    { key: "amount", header: "Amount", render: (p: Payment) => formatCurrency(p.amount) },
    { key: "paymentMethod", header: "Method", render: (p: Payment) => <Badge variant="info" size="sm">{p.paymentMethod}</Badge> },
    { key: "paidAt", header: "Date", render: (p: Payment) => format(new Date(p.paidAt), "MMM dd, yyyy") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Payments</h1><Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Record Payment</Button></div>
      <DataTable columns={columns} data={payments} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No payments found" />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Payment">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Invoice ID" {...register("invoiceId")} required />
          <Input label="Amount" type="number" {...register("amount", { valueAsNumber: true })} required />
          <Select label="Payment Method" options={[{ value: "cash", label: "Cash" }, { value: "mpesa", label: "M-Pesa" }, { value: "bank", label: "Bank" }, { value: "cheque", label: "Cheque" }]} {...register("paymentMethod")} required />
          <Input label="Paid By" {...register("paidBy")} required />
          <Input label="Transaction ID" {...register("transactionId")} />
          <Input label="Notes" {...register("notes")} />
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting}>Save</Button></div>
        </form>
      </Modal>
    </div>
  );
}
