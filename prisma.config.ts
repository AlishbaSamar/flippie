import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need session-level features (advisory locks, DDL) that PgBouncer's
    // pooled connection doesn't support — use the direct connection here. The
    // running app is unaffected: src/lib/prisma.ts reads DATABASE_URL (pooled)
    // directly, independent of this CLI-only config.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
