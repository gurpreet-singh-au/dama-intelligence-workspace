export function LegalSafetyBanner({ children, tone = "warning" }: { children: string; tone?: "warning" | "danger" }) {
  return (
    <div className={tone === "danger" ? "danger" : "warning"} role="note">
      {children}
    </div>
  );
}
