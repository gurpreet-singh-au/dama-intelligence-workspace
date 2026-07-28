import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Sources", "/sources"],
  ["Occupations", "/occupations"],
  ["Review Queue", "/review-queue"],
  ["Comparison", "/comparison"],
  ["Audit Log", "/audit-log"],
  ["Settings", "/settings"]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">DAMA Intelligence Workspace</div>
        <nav className="nav" aria-label="Workspace navigation">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
