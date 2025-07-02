// File: app/dashboard/layout.tsx
import React from "react";
import Header from "@/components/UI/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
