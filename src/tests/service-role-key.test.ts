import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");

function readSource(relativePath: string) {
  return readFileSync(join(sourceRoot, relativePath), "utf8");
}

describe("service role key exposure", () => {
  it("does not expose the service role key in client or shared Supabase code", () => {
    const client = readSource("lib/supabase/client.ts");
    const server = readSource("lib/supabase/server.ts");

    expect(client).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(server).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
