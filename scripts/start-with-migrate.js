/**
 * Runs prisma migrate deploy before starting the app.
 * Migrations run at startup (not build) because Hostinger's build env may not have MySQL access.
 */
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;
const isPlaceholder = !dbUrl || dbUrl.includes("localhost:3306/placeholder");

const { execSync } = require("child_process");

if (!isPlaceholder) {
  try {
    console.log("Running database migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  } catch (err) {
    console.error("prisma migrate deploy failed:", err.message);
    process.exit(1);
  }
}

execSync("npx next start", { stdio: "inherit" });
