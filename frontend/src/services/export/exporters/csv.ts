export interface CSVExportOptions {
  fileName: string;
  data: Record<string, unknown>[];
}

export async function exportCSV({
  fileName,
  data,
}: CSVExportOptions): Promise<void> {
  if (!data.length) {
    throw new Error("No data available to export.");
  }

  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];

          const text = value == null ? "" : String(value);

          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}