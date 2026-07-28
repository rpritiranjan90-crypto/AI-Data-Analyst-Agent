import { useState } from "react";
import { BookOpen, FileText, Upload, Folder, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../components/ui/PageHeader";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  collection: string;
  size: string;
  embeddings: number;
  updated: string;
}

export default function RAGKnowledgePage() {
  const [activeCollection, setActiveCollection] = useState("All Collections");
  const [search, setSearch] = useState("");

  const collections = ["All Collections", "Corporate Policies", "Financial Reports", "Standard Operating Procedures (SOPs)", "Contracts & Compliance"];

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "1", name: "2026_Q2_Financial_Audit_Report.pdf", type: "PDF", collection: "Financial Reports", size: "4.2 MB", embeddings: 1420, updated: "Yesterday" },
    { id: "2", name: "Enterprise_SLA_Security_Policy.docx", type: "DOCX", collection: "Corporate Policies", size: "1.8 MB", embeddings: 680, updated: "3 days ago" },
    { id: "3", name: "Customer_Onboarding_SOP_v3.md", type: "Markdown", collection: "Standard Operating Procedures (SOPs)", size: "320 KB", embeddings: 240, updated: "1 week ago" },
    { id: "4", name: "Vendor_Procurement_Contract_2026.pdf", type: "PDF", collection: "Contracts & Compliance", size: "2.5 MB", embeddings: 910, updated: "2 weeks ago" },
  ]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    toast.info(`Indexing "${file.name}" into Vector Knowledge Base...`);

    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "DOC",
        collection: activeCollection === "All Collections" ? "Corporate Policies" : activeCollection,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        embeddings: Math.floor(Math.random() * 800) + 200,
        updated: "Just now",
      };
      setDocuments((prev) => [newDoc, ...prev]);
      toast.success(`Indexed "${file.name}" with vector embeddings! AI Copilot ready.`);
    }, 600);
  }

  function handleDelete(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document removed from Knowledge Base.");
  }

  const filteredDocs = documents.filter((doc) => {
    const matchCol = activeCollection === "All Collections" || doc.collection === activeCollection;
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.collection.toLowerCase().includes(search.toLowerCase());
    return matchCol && matchSearch;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Knowledge"
        title="RAG Vector Knowledge Base & Document Collections"
        subtitle="Upload corporate PDFs, DOCX, SOPs, and contracts into vector collections for cited AI Copilot responses."
      />

      {/* Upload Banner */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-600/20 p-3 text-indigo-600 dark:text-indigo-400">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Semantic Document Intelligence & Vector Search
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Vectorized documents enable AI Copilot to provide cited responses combining live CSV/SQL datasets + enterprise knowledge.
            </p>
          </div>
        </div>

        <label className="cursor-pointer">
          <input type="file" onChange={handleFileUpload} className="hidden" />
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition">
            <Upload size={16} /> Index Document
          </span>
        </label>
      </div>

      {/* Collections Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        {collections.map((col) => (
          <button
            key={col}
            onClick={() => setActiveCollection(col)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCollection === col
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Folder size={14} className="inline mr-1.5" /> {col}
          </button>
        ))}
      </div>

      {/* Document List Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-indigo-600 dark:text-indigo-400" /> Vector Indexed Documents ({filteredDocs.length})
          </h4>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge base..."
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-8 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Collection</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3">Vector Embeddings</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={15} className="text-indigo-600 dark:text-indigo-400" /> {doc.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{doc.collection}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{doc.type}</td>
                  <td className="px-4 py-3 text-slate-500">{doc.size}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {doc.embeddings} Vectors
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
