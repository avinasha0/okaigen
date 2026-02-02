/**
 * Runs prisma migrate deploy before starting the app.
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

if (isPlaceholder) {
  console.warn(
    "[start-with-migrate] Skipping migrations: DATABASE_URL is not set or is placeholder."
  );
  console.warn(
    "[start-with-migrate] Set DATABASE_URL in your hosting Environment Variables and use Start command: npm start"
  );
} else {
  try {
    console.log("[start-with-migrate] Running database migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("[start-with-migrate] Migrations completed.");
  } catch (err) {
    console.error("[start-with-migrate] prisma migrate deploy failed:", err.message);
    process.exit(1);
  }
}

execSync("npx next start", { stdio: "inherit" });
