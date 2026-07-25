import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Zap, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
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

  const onDropRejected = useCallback((fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const err = fileRejections[0].errors[0];
      toast.error(`File rejected: ${err?.message || "Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)"}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".csv", ".txt", ".tsv"],
      "application/csv": [".csv"],
      "text/x-csv": [".csv"],
      "application/x-csv": [".csv"],
      "text/comma-separated-values": [".csv"],
      "text/x-comma-separated-values": [".csv"],
      "application/vnd.ms-excel": [".xls", ".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    onDrop,
    onDropRejected,
  });

  async function handleUpload() {
    if (!selectedFile) return;
    try {
      setUploading(true);
      setProgress(10);
      const response = await uploadDataset(selectedFile, (p) => setProgress(Math.max(p, 10)));
      setDataset(response);
      toast.success(`Dataset "${selectedFile.name}" processed successfully!`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || error.response?.data?.message || error.message || "Upload failed. Please check your backend connection.";
      toast.error(`Upload error: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Importer"
        title="Dataset Importer"
        subtitle="Import CSV or Excel datasets to enable AI-powered analytics, cleaning, visualizations, and ML modeling."
      />

      {/* Redesigned Dropzone Card */}
      <div
        {...getRootProps()}
        className={`group relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-4 ring-indigo-500/10"
            : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-900 hover:bg-indigo-50/30"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          <UploadCloud
            size={48}
            className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors duration-200 mb-4"
          />

          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Drop your dataset here
          </h3>

          <p className="text-sm text-slate-400 mb-6">
            CSV or Excel · up to 50MB
          </p>

          <Button type="button" variant="primary" size="md">
            Browse files
          </Button>
        </div>
      </div>

      {/* Selected File Preview Card */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!uploading && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> Ready to Process
                </span>
              )}
              {!uploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap size={12} className="text-indigo-600 dark:text-indigo-400" /> Processing dataset with AI engine...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              variant="primary"
            >
              {uploading ? "Processing..." : "Upload & Analyze Dataset"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}