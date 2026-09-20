import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string, sheetName = 'Sheet1') => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToExcelWithHeaders = (data: any[], headers: Record<string, string>, filename: string, sheetName = 'Sheet1') => {
  const mapped = data.map(row => {
    const newRow: any = {};
    Object.entries(headers).forEach(([key, label]) => {
      newRow[label] = row[key] ?? '';
    });
    return newRow;
  });
  exportToExcel(mapped, filename, sheetName);
};
