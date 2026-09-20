import { useState, useEffect } from "react";
import { receiptsApi } from "@/api/receipts.api";
import { Receipt } from "@/types";
import DataTable from "@/components/common/DataTable";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => { setLoading(true); try { const res = await receiptsApi.getAll({ page, limit: 10 }); setReceipts(res.data); setTotalPages(res.totalPages); } catch(e){} setLoading(false); };
  useEffect(() => { fetchData(); }, [page]);

  const columns = [
    { key: "receiptNumber", header: "Receipt No.", render: (r: Receipt) => <span className="font-medium">{r.receiptNumber}</span> },
    { key: "studentName", header: "Student", render: (r: Receipt) => `${r.student?.firstName || ""} ${r.student?.lastName || ""}` },
    { key: "amount", header: "Amount", render: (r: Receipt) => formatCurrency(r.amount) },
    { key: "description", header: "Description" },
    { key: "issuedAt", header: "Date", render: (r: Receipt) => format(new Date(r.issuedAt), "MMM dd, yyyy") },
  ];

  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Receipts</h1><DataTable columns={columns} data={receipts} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} emptyMessage="No receipts found" /></div>);
}
