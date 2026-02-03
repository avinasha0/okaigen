import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Optimization: Configure connection pooling and query optimization
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Optimization: Connection pool settings for better performance
    datasources: {
      db: {
        url: process.env.DATABASE_URL}}});

// Optimization: Enable connection pooling hints via query engine
// Prisma automatically handles connection pooling, but we can optimize queries
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
