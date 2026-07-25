import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Sparkles, Zap, X } from "lucide-react";
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
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
        title="Dataset Importer"
        subtitle="Import CSV or Excel datasets to enable AI-powered analytics, cleaning, visualizations, and ML modeling."
      />

      {/* Executive Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/60 shadow-2xl shadow-slate-900/20"
      >
        {/* Ambient glow blobs */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-purple-600/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 p-8 space-y-6">
          {/* Badge & Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
              <Sparkles size={12} className="text-blue-400" />
              Secure Dataset Upload Portal
            </div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Upload Your Dataset
            </h2>
            <p className="text-sm text-slate-400">
              Supports CSV, XLS, XLSX — up to 50MB. Your data is processed securely.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              isDragActive
                ? "border-blue-400 bg-blue-500/10 scale-[0.99] shadow-inner shadow-blue-500/10"
                : "border-slate-600 hover:border-blue-500 hover:bg-slate-800/60"
            }`}
          >
            <input {...getInputProps()} />

            <motion.div
              animate={isDragActive ? { scale: 1.15 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner"
            >
              <UploadCloud size={40} />
            </motion.div>

            {isDragActive ? (
              <h3 className="text-xl font-extrabold text-blue-300">
                Drop your file here!
              </h3>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-white">
                  Drag & Drop your dataset here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  or click to browse your files
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200">
                  <UploadCloud size={16} /> Select File
                </div>
              </>
            )}
          </div>

          {/* Supported formats */}
          <div className="flex flex-wrap items-center gap-3">
            {[".CSV", ".XLS", ".XLSX"].map((fmt) => (
              <span
                key={fmt}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 text-xs font-bold text-slate-300"
              >
                <FileSpreadsheet size={12} className="text-emerald-400" />
                {fmt}
              </span>
            ))}
            <span className="text-xs text-slate-500">• Max 50MB per file</span>
          </div>
        </div>
      </motion.div>

      {/* Selected File Preview */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 shadow-xl"
        >
          <div className="absolute -top-8 right-0 h-32 w-32 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-emerald-400">
                <FileSpreadsheet size={28} />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">{selectedFile.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!uploading && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={14} /> Ready to Upload
                </span>
              )}
              {!uploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="relative z-10 mt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap size={12} className="text-blue-400" /> Uploading & processing dataset...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="relative z-10 mt-6 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20 px-7 py-2.5 active:scale-95"
            >
              {uploading ? "Uploading..." : "Process Dataset"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}