/**
 * Runs prisma migrate deploy before build.
 * Only runs when DATABASE_URL is set and points to a real database (not placeholder).
 * On Hostinger: env vars are injected during build -> migrations run automatically.
 */
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;
const isPlaceholder =
  !dbUrl || dbUrl.includes("localhost:3306/placeholder");

if (isPlaceholder) {
  console.log(
    "Skipping prisma migrate deploy (DATABASE_URL not configured or placeholder)"
  );
  process.exit(0);
}

const { execSync } = require("child_process");
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch (err) {
  console.error("prisma migrate deploy failed:", err.message);
  process.exit(1);
}
