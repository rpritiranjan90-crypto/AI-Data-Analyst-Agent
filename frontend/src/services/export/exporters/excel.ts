import * as XLSX from "xlsx";

export interface ExcelSheet {
  name: string;
  data: Record<string, unknown>[];
}

export interface ExcelExportOptions {
  fileName: string;
  sheets: ExcelSheet[];
}

export async function exportExcel({
  fileName,
  sheets,
}: ExcelExportOptions): Promise<void> {
  if (!sheets.length) {
    throw new Error("No sheets available to export.");
  }

  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheet.name,
    );
  });

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}