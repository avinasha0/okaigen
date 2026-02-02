/**
 * Runs prisma migrate deploy and seed before starting the app.
 * Migrations run at startup (not build) because Hostinger's build env may not have MySQL access.
 * Start command on Hostinger MUST be "npm start" (not "next start") so this script runs.
 */
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;
const isPlaceholder =
  !dbUrl ||
  String(dbUrl).trim() === "" ||
  dbUrl.includes("localhost:3306/placeholder");

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Create _next symlink so static files at /_next/* are reachable (some hosts block dot-folders)
const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");
const nextLink = path.join(root, "_next");
if (fs.existsSync(nextDir) && !fs.existsSync(nextLink)) {
  try {
    fs.symlinkSync(nextDir, nextLink);
    console.log("[start-with-migrate] Created _next -> .next symlink");
  } catch (e) {
    console.warn("[start-with-migrate] Could not create _next symlink:", e.message);
  }
}

if (isPlaceholder) {
  console.warn(
    "[start-with-migrate] Skipping migrations: DATABASE_URL is not set or is placeholder."
  );
  console.warn(
    "[start-with-migrate] Set DATABASE_URL in your hosting Environment Variables and use Start command: npm start"
  );
} else {
  // Log that we're using a real DB (helpful when DB was recreated elsewhere)
  const hostMatch = dbUrl.match(/@([^/]+)\//);
  const host = hostMatch ? hostMatch[1].replace(/:.*$/, "") : "unknown";
  console.log("[start-with-migrate] DATABASE_URL set, host: " + host);

  try {
    console.log("[start-with-migrate] Running database migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("[start-with-migrate] Migrations completed.");

    // Seed plans after migrations (idempotent - safe to run multiple times)
    console.log("[start-with-migrate] Seeding plans...");
    try {
      execSync("npm run db:seed", { stdio: "inherit" });
      console.log("[start-with-migrate] Plans seeded successfully.");
    } catch (seedErr) {
      // Don't fail startup if seed fails (plans might already exist)
      console.warn("[start-with-migrate] Seed warning:", seedErr.message);
      console.warn("[start-with-migrate] Continuing startup...");
    }
  } catch (err) {
    console.error("[start-with-migrate] prisma migrate deploy failed:", err.message);
    console.warn("[start-with-migrate] Continuing to start app. Fix DATABASE_URL and restart to run migrations.");
    // Don't exit(1) so the app can start; you can fix DB and restart
  }
}

execSync("npx next start", { stdio: "inherit" });
