import { prisma } from "@/lib/db";

export const APP_CONFIG_KEYS = {
  gaMeasurementId: "ga_measurement_id",
} as const;

export async function getAppConfig(key: string) {
  const row = await prisma.appConfig.findUnique({ where: { key }, select: { value: true } });
  return row?.value ?? null;
}

export async function setAppConfig(key: string, value: string | null) {
  if (value === null) {
    await prisma.appConfig.delete({ where: { key } }).catch(() => null);
    return;
  }

  await prisma.appConfig.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

