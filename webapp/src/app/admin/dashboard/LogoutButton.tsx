"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-400 hover:text-[#E4E9F2] hover:bg-white/5 rounded-lg transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
