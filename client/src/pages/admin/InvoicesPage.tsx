import { useState, useEffect } from "react";
import { feesApi } from "@/api/fees.api";
import { Invoice } from "@/types";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => { setLoading(true); try { const res = await feesApi.getInvoices({ page, limit: 10 }); setInvoices(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const statusBadge = (s: string) => { const m: Record<string, any> = { paid: "success", partial: "warning", pending: "info", overdue: "danger" }; return <Badge variant={m[s] || "gray"} size="sm">{s}</Badge>; };

  const columns = [
    { key: "invoiceNumber", header: "Invoice No.", render: (i: Invoice) => <span className="font-medium">{i.invoiceNumber}</span> },
    { key: "studentName", header: "Student", render: (i: Invoice) => `${i.student?.firstName || ""} ${i.student?.lastName || ""}` },
    { key: "amount", header: "Amount", render: (i: Invoice) => formatCurrency(i.amount) },
    { key: "amountPaid", header: "Paid", render: (i: Invoice) => formatCurrency(i.amountPaid) },
    { key: "balance", header: "Balance", render: (i: Invoice) => <span className={i.balance > 0 ? "text-red-600" : "text-green-600"}>{formatCurrency(i.balance)}</span> },
    { key: "status", header: "Status", render: (i: Invoice) => statusBadge(i.status) },
    { key: "dueDate", header: "Due Date", render: (i: Invoice) => format(new Date(i.dueDate), "MMM dd, yyyy") },
  ];

  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Invoices</h1><DataTable columns={columns} data={invoices} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No invoices found" /></div>);
}
