"use client";

import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar>
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </Sidebar>
    </div>
  );
}
