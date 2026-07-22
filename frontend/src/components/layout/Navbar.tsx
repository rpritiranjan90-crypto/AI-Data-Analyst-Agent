import {
  Bell,
  Plus,
  Search,
  UserCircle2,
} from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:block">
          <Input
            placeholder="Search datasets, reports..."
            className="w-96"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="primary">
          <Plus size={18} />
          <span className="ml-2">New Analysis</span>
        </Button>

        <button className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">
          <Search size={18} />
        </button>

        <button className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
          <UserCircle2 size={38} />

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">
              User
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}