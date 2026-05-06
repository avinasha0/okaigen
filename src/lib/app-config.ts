import { prisma } from "@/lib/db";

export const APP_CONFIG_KEYS = {
  gaMeasurementId: "ga_measurement_id",
} as const;

function isMissingTableError(e: unknown) {
  // Prisma KnownRequestError uses code "P2021" for missing table.
  // We avoid importing Prisma runtime types here to keep this module simple.
  if (!e || typeof e !== "object") return false;
  const anyErr = e as { code?: unknown; message?: unknown };
  if (anyErr.code === "P2021") return true;
  const msg = typeof anyErr.message === "string" ? anyErr.message : "";
  return msg.includes("The table `AppConfig` does not exist") || msg.includes("prisma.appConfig");
}

export async function getAppConfig(key: string) {
  try {
    const row = await prisma.appConfig.findUnique({ where: { key }, select: { value: true } });
    return row?.value ?? null;
  } catch (e) {
    // If migration hasn't run yet, behave like "unset" instead of throwing.
    if (isMissingTableError(e)) return null;
    throw e;
  }
}

export async function setAppConfig(key: string, value: string | null) {
  try {
    if (value === null) {
      await prisma.appConfig.delete({ where: { key } }).catch(() => null);
      return;
    }

    await prisma.appConfig.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  } catch (e) {
    if (isMissingTableError(e)) {
      throw new Error("AppConfig table is missing. Run Prisma migrations to enable superadmin configuration.");
    }
    throw e;
  }
}

