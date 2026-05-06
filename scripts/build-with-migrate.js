/**
 * Build script that runs migrations and seed before building Next.js.
 * Use this as your Build command: node scripts/build-with-migrate.js
 */
require("dotenv").config();

const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL;
const isPlaceholder =
  !dbUrl ||
  String(dbUrl).trim() === "" ||
  dbUrl.includes("localhost:3306/placeholder");

console.log("=== Build with Migrate ===");

// Step 1: Generate Prisma client
console.log("[1/4] Generating Prisma client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("[1/4] ✓ Prisma client generated");
} catch (err) {
  console.error("[1/4] ✗ Prisma generate failed:", err.message);
  process.exit(1);
}

// Step 2: Run migrations (if DATABASE_URL is set)
if (isPlaceholder) {
  console.warn("[2/4] ⚠ Skipping migrations: DATABASE_URL not set or is placeholder");
  console.warn("[2/4] Set DATABASE_URL in Environment Variables to create tables");
} else {
  const hostMatch = dbUrl.match(/@([^/]+)\//);
  const host = hostMatch ? hostMatch[1].replace(/:.*$/, "") : "unknown";
  console.log("[2/4] Running migrations (host: " + host + ")...");
  try {
    // Use migrate deploy - it's idempotent and safe for production
    // If _prisma_migrations table exists, it checks what's already applied
    // If database is fresh, it applies all migrations
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("[2/4] ✓ Migrations completed");
  } catch (err) {
    console.error("[2/4] ✗ Migrations failed");
    console.error("[2/4] Full error:", err.message);
    console.error("[2/4] =========================================");
    console.error("[2/4] TROUBLESHOOTING:");
    console.error("[2/4] 1. Check DATABASE_URL is set in Vercel:");
    console.error("[2/4]    Project → Settings → Environment Variables");
    console.error("[2/4]    Must be set for Production (and Preview if used)");
    console.error("[2/4] 2. Verify DATABASE_URL format:");
    console.error("[2/4]    mysql://USER:PASSWORD@HOST:3306/DATABASE");
    console.error("[2/4] 3. Check database allows connections from Vercel IPs");
    console.error("[2/4] =========================================");
    process.exit(1);
  }

  // Step 3: Seed plans
  console.log("[3/4] Seeding plans...");
  try {
    execSync("npm run db:seed", { stdio: "inherit" });
    console.log("[3/4] ✓ Plans seeded");
  } catch (err) {
    console.warn("[3/4] ⚠ Seed failed:", err.message);
    console.warn("[3/4] Continuing build (plans might already exist)");
    // Don't exit - seed failure is non-critical
  }
} else {
  console.warn("[2/4] ⚠ Migrations skipped (no DATABASE_URL)");
  console.warn("[3/4] ⚠ Seed skipped (no DATABASE_URL)");
}

// Step 4: Build Next.js
console.log("[4/4] Building Next.js...");
try {
  execSync("next build", { stdio: "inherit" });
  console.log("[4/4] ✓ Build completed");
} catch (err) {
  console.error("[4/4] ✗ Build failed:", err.message);
  process.exit(1);
}

console.log("=== Build Complete ===");
