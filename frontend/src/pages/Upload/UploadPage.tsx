import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import { useDropzone } from "react-dropzone";

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

      const response = await uploadDataset(
        selectedFile,
        setProgress
      );

      setDataset(response);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload Dataset"
        subtitle="Upload CSV or Excel datasets for AI-powered analytics."
      />

      <Card>
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            isDragActive
              ? "border-blue-600 bg-blue-50"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />

          <UploadCloud
            size={70}
            className="mx-auto mb-6 text-blue-600"
          />

          <h2 className="text-2xl font-bold">
            Drag & Drop Dataset Here
          </h2>

          <p className="mt-3 text-slate-500">
            CSV • XLS • XLSX
          </p>

          <Button className="mt-8">
            Browse Files
          </Button>
        </div>

        {selectedFile && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-4">
              <FileSpreadsheet
                size={36}
                className="text-green-600"
              />

              <div>
                <h3 className="font-semibold">
                  {selectedFile.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {uploading && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between">
                  <span>Uploading...</span>

                  <span>{progress}%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <Button
              className="mt-8"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Dataset"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}