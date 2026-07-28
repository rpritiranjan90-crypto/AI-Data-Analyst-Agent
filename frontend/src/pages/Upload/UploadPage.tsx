import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Zap, X, Database, Play, RefreshCw, Server, Code, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

import { uploadDataset } from "../../services/uploadService";
import { testDbConnection, listDbTables, queryDatabase, generateNlToSql } from "../../services/databaseService";
import { useDatasetStore } from "../../store/datasetStore";

export default function UploadPage() {
  const navigate = useNavigate();
  const setDataset = useDatasetStore((state) => state.setDataset);

  const [mode, setMode] = useState<"file" | "database">("file");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Database Connection State
  const [dbUri, setDbUri] = useState("");
  const [dbPreset, setDbPreset] = useState<"postgres" | "mysql" | "sqlite" | "custom">("sqlite");
  const [testingDb, setTestingDb] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("sales");
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM sales LIMIT 500");
  const [datasetName, setDatasetName] = useState("db_sales_data");
  const [querying, setQuerying] = useState(false);

  // Natural Language to SQL Assistant State
  const [nlPrompt, setNlPrompt] = useState("");
  const [generatingSql, setGeneratingSql] = useState(false);

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
    let timer: ReturnType<typeof setInterval> | null = null;
    try {
      setUploading(true);
      setProgress(15);

      timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 400);

      const response = await uploadDataset(selectedFile);
      if (timer) clearInterval(timer);
      setProgress(100);

      setDataset(response);
      toast.success(`Dataset "${selectedFile.name}" processed successfully!`);
      setTimeout(() => navigate("/dashboard"), 400);
    } catch (error: any) {
      if (timer) clearInterval(timer);
      console.error(error);
      const msg = error.response?.data?.detail || error.response?.data?.message || error.message || "Upload failed. Please check your backend connection.";
      toast.error(`Upload error: ${msg}`);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }

  async function handleTestDbConnection() {
    if (!dbUri) {
      toast.error("Please enter a database connection URI.");
      return;
    }
    try {
      setTestingDb(true);
      const res = await testDbConnection(dbUri);
      if (res.success) {
        toast.success(res.message);
        setDbConnected(true);
        try {
          const tablesRes = await listDbTables(dbUri);
          if (tablesRes.success) setDbTables(tablesRes.tables);
        } catch {
          // ignore table list error if permission restricted
        }
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || error.response?.data?.message || error.message || "Connection failed.";
      toast.error(`Database error: ${msg}`);
      setDbConnected(false);
    } finally {
      setTestingDb(false);
    }
  }

  async function handleGenerateNlToSql() {
    if (!nlPrompt) {
      toast.error("Please enter a plain English question.");
      return;
    }
    try {
      setGeneratingSql(true);
      toast.info("Generating SQL query with AI engine...");
      const res = await generateNlToSql(nlPrompt, selectedTable || "dataset");
      if (res.success && res.generated_sql) {
        setSqlQuery(res.generated_sql);
        toast.success("SQL query generated successfully!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to generate SQL. Using default query.");
    } finally {
      setGeneratingSql(false);
    }
  }

  async function handleExecuteDbQuery() {
    if (!dbUri || !sqlQuery) {
      toast.error("Please enter both database URI and SQL query.");
      return;
    }
    try {
      setQuerying(true);
      toast.info("Executing SQL query and profiling dataset...");
      const response = await queryDatabase({
        connection_string: dbUri,
        query: sqlQuery,
        dataset_name: datasetName,
      });

      setDataset(response);
      toast.success(`Database query dataset "${datasetName}" loaded successfully!`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || error.response?.data?.message || error.message || "Query execution failed.";
      toast.error(`SQL Error: ${msg}`);
    } finally {
      setQuerying(false);
    }
  }

  function applyPreset(preset: "postgres" | "mysql" | "sqlite" | "custom") {
    setDbPreset(preset);
    if (preset === "postgres") {
      setDbUri("postgresql://username:password@localhost:5432/dbname");
    } else if (preset === "mysql") {
      setDbUri("mysql+pymysql://username:password@localhost:3306/dbname");
    } else if (preset === "sqlite") {
      setDbUri("sqlite:///sample.db");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Importer"
        title="Dataset Importer & SQL Connectors"
        subtitle="Import CSV / Excel files or connect live SQL databases (PostgreSQL, MySQL, SQLite, Snowflake) for AI analytics."
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setMode("file")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            mode === "file"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <FileSpreadsheet size={18} /> File Upload (.csv, .xlsx)
        </button>

        <button
          onClick={() => setMode("database")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            mode === "database"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Database size={18} /> Live SQL Database Connector
        </button>
      </div>

      {/* Mode 1: File Upload */}
      {mode === "file" && (
        <div className="space-y-6">
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

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Drop your dataset here
              </h3>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-6">
                CSV or Excel · up to 50MB
              </p>

              <Button type="button" variant="primary" size="md">
                Browse files
              </Button>
            </div>
          </div>

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
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedFile.name}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mt-0.5">
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

              {uploading && (
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-indigo-600 dark:text-indigo-400 animate-pulse" /> Processing dataset with AI engine...
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
      )}

      {/* Mode 2: SQL Database Connector */}
      {mode === "database" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="text-indigo-600 dark:text-indigo-400" size={20} /> Connect Live SQL Database
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-200 mt-1">
                Enter your SQLAlchemy URI or choose a preset to pull tables directly into the AI Data Analyst engine.
              </p>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2 block">
                Select Database Type Preset
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => applyPreset("sqlite")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dbPreset === "sqlite"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  SQLite (.db)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("postgres")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dbPreset === "postgres"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  PostgreSQL
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("mysql")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dbPreset === "mysql"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  MySQL
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("custom")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dbPreset === "custom"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Custom Connection String
                </button>
              </div>
            </div>

            {/* Connection URI Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Database Connection URI
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={dbUri}
                  onChange={(e) => setDbUri(e.target.value)}
                  placeholder="postgresql://username:password@localhost:5432/dbname"
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
                <Button
                  type="button"
                  onClick={handleTestDbConnection}
                  disabled={testingDb}
                  variant="outline"
                >
                  {testingDb ? <RefreshCw size={16} className="animate-spin" /> : "Test Connection"}
                </Button>
              </div>
            </div>

            {/* Discovered Tables */}
            {dbConnected && dbTables.length > 0 && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 p-4 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Discovered Tables in Database ({dbTables.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {dbTables.map((tbl) => (
                    <button
                      key={tbl}
                      type="button"
                      onClick={() => {
                        setSelectedTable(tbl);
                        setSqlQuery(`SELECT * FROM ${tbl} LIMIT 1000`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        selectedTable === tbl
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Natural Language SQL Assistant */}
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" /> Talk to Database (Natural Language to SQL)
                </label>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                  AI Generator
                </span>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={nlPrompt}
                  onChange={(e) => setNlPrompt(e.target.value)}
                  placeholder="e.g. Show top 10 customers by total sales amount last quarter"
                  className="flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
                <Button
                  type="button"
                  onClick={handleGenerateNlToSql}
                  disabled={generatingSql}
                  variant="primary"
                >
                  {generatingSql ? <RefreshCw size={16} className="animate-spin" /> : "✨ Generate SQL"}
                </Button>
              </div>
            </div>

            {/* SQL Query Editor & Dataset Name */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Code size={16} className="text-indigo-600 dark:text-indigo-400" /> SQL Query Editor
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="Dataset Label"
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100"
                />
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                placeholder="SELECT * FROM sales LIMIT 500"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-slate-100 p-4 font-mono text-sm outline-none focus:border-indigo-500"
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleExecuteDbQuery}
                  disabled={querying}
                  variant="primary"
                  size="lg"
                >
                  {querying ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" /> Querying Database & Profiling...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Play size={16} /> Execute Query & Load Dataset
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}