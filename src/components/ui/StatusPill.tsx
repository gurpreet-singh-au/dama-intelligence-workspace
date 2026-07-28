export function StatusPill({ children }: { children: string }) {
  return <span className="pill">{children.replaceAll("_", " ")}</span>;
}
