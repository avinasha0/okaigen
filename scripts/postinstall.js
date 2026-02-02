/**
 * Runs prisma generate. Uses a placeholder DATABASE_URL if not set
 * (needed for Hostinger/CI where env vars may not be available during npm install).
 * prisma generate does not connect to the DB - it only needs the var for schema parsing.
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://localhost:3306/placeholder";
}
require("child_process").execSync("npx prisma generate", { stdio: "inherit" });
