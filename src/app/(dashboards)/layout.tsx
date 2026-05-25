"use client";

export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg">
      {children}
    </div>
  );
}
