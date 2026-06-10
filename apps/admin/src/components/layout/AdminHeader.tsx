"use client";
import { useAuth } from "@/hooks/useAuth";
import { Bell, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors relative">
          <Bell className="w-4 h-4 text-gray-500" />
        </button>

        <div className="relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-7 h-7 bg-[#0F6A4A]/10 rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#0F6A4A]" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
