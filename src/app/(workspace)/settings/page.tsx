import { roleBoundaryNote } from "@/lib/permissions";
import { APP_ROLES } from "@/types/enums";

export default function SettingsPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Roles and permissions</div>
          <h1>Settings</h1>
          <p>Role foundations are internal-only and preserve professional review boundaries.</p>
        </div>
      </div>
      <div className="grid">
        {APP_ROLES.map((role) => (
          <section className="card" key={role}>
            <h2>{role.replaceAll("_", " ")}</h2>
            <p>{roleBoundaryNote(role)}</p>
          </section>
        ))}
      </div>
    </>
  );
}
