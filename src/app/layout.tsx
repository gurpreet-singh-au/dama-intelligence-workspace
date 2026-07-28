import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAMA Intelligence Workspace",
  description: "Internal DAMA source-backed comparison workspace"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
