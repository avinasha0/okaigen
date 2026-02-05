import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BotCounts } from "@/components/bot-counts";

export default async function BotsSection({
  ownerId,
  canCreateBot,
  planUsage,
}: {
  ownerId: string;
  canCreateBot: boolean;
  planUsage: any;
}) {
  const bots = await prisma.bot.findMany({
    where: { userId: ownerId },
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {bots.length === 0 ? (
        <Card className="border-zinc-200 bg-white">
          <div className="p-4 sm:p-6">
            <div className="text-zinc-900 font-semibold">No bots yet</div>
            <div className="text-zinc-500">
              Create your first bot to get started. Add your website URL or upload documents to train your AI assistant.
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-100">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-zinc-50/80 sm:p-6 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/bots/${bot.id}`}
                    className="font-medium text-zinc-900 hover:text-[#1a6aff] hover:underline"
                  >
                    {bot.name}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    <BotCounts botId={bot.id} />
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/bots/${bot.id}/analytics`} className="flex-1 min-w-[100px] sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full border-zinc-300 text-zinc-700 sm:w-auto">
                      Analytics
                    </Button>
                  </Link>
                  <Link href={`/dashboard/bots/${bot.id}/chats`} className="flex-1 min-w-[100px] sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full border-zinc-300 text-zinc-700 sm:w-auto">
                      Chats
                    </Button>
                  </Link>
                  <Link href={`/dashboard/bots/${bot.id}/leads`} className="flex-1 min-w-[100px] sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full border-zinc-300 text-zinc-700 sm:w-auto">
                      Leads
                    </Button>
                  </Link>
                  <Link href={`/dashboard/bots/${bot.id}`} className="flex-1 min-w-[100px] sm:flex-none">
                    <Button size="sm" className="w-full bg-[#1a6aff] hover:bg-[#1557e0] sm:w-auto">
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
