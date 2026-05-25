"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import EsskayLogo from "@/components/ui/EsskayLogo";
import {
  LayoutDashboard, Settings, Home, Upload, Mic2, Star, Tags, Film,
  HelpCircle, CheckCircle, Mail, Users,
  ImageIcon
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  badge?: "pending";
}

const menuGroups: { label: string | null; items: MenuItem[] }[] = [
  {
    label: null,
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Site Settings", href: "/admin/dashboard/settings", icon: Settings },
      { name: "Homepage Builder", href: "/admin/dashboard/homepage", icon: Home },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Artists", href: "/admin/dashboard/artists", icon: Mic2 },
      { name: "Signed Artists", href: "/admin/dashboard/signed-artists", icon: Star },
      { name: "Labels", href: "/admin/dashboard/labels", icon: Tags },
      { name: "Videos", href: "/admin/dashboard/videos", icon: Film },
      { name: "FAQ", href: "/admin/dashboard/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Workflow",
    items: [
      { name: "Upload Release", href: "/admin/dashboard/upload", icon: Upload },
      { name: "Release Reviews", href: "/admin/dashboard/reviews", icon: CheckCircle, badge: "pending" },
      { name: "Inquiries", href: "/admin/dashboard/inquiries", icon: Mail },
      { name: "Users", href: "/admin/dashboard/users", icon: Users },
    ],
  },
  {
    label: "Media",
    items: [
      { name: "Media Library", href: "/admin/dashboard/media", icon: ImageIcon },
    ],
  },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchCounts = async () => {
      const { count } = await supabase
        .from("releases")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      setPendingCount(count || 0);
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-brand-surface border-r border-brand-border transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 h-16 px-4 border-b border-brand-border hover:bg-white/5 transition-colors group"
          title="Back to Site"
        >
          <EsskayLogo size={24} showText={false} />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark group-hover:text-brand-primary transition-colors whitespace-nowrap">
            Back to Site
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {menuGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && !collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted-dark px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const showBadge = item.badge === "pending" && pendingCount > 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                          : "text-brand-muted-dark hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}
                      {!collapsed && showBadge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-500">
                          {pendingCount}
                        </span>
                      )}
                      {collapsed && showBadge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </aside>

      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {children}
      </div>
    </div>
  );
}
