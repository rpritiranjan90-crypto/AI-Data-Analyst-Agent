import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

import { uploadDataset } from "../../services/uploadService";
import { useDatasetStore } from "../../store/datasetStore";

export default function UploadPage() {
  const navigate = useNavigate();
  const setDataset = useDatasetStore((state) => state.setDataset);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop,
  });

  async function handleUpload() {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await uploadDataset(selectedFile, setProgress);
      setDataset(response);
      toast.success(`Dataset "${selectedFile.name}" uploaded successfully!`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Dataset upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload Dataset"
        subtitle="Import CSV or Excel datasets to enable AI-powered data analytics, cleaning, visualizations, and ML modeling."
      />

      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
            isDragActive
              ? "border-blue-600 bg-blue-50/70 scale-[0.99]"
              : "border-slate-300 hover:border-blue-500 hover:bg-slate-50/50"
          }`}
        >
          <input {...getInputProps()} />

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
            <UploadCloud size={40} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Drag & Drop your dataset here
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Supports CSV, XLS, XLSX formats up to 50MB
          </p>

          <Button className="mt-6" variant="secondary">
            Select File
          </Button>
        </div>

        {selectedFile && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                  <FileSpreadsheet size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {!uploading && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={14} /> Ready to upload
                </span>
              )}
            </div>

            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Uploading dataset...</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? "Uploading..." : "Process Dataset"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}