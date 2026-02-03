import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { BrandingToggle } from "@/components/branding-toggle";
import { DeleteBotButton } from "@/components/delete-bot-button";
import { EmbedInstructions } from "@/components/embed-instructions";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import { generateBotPublicKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from "@/components/ui/card";

export default async function BotDetailPage({
  params}: {
  params: Promise<{ botId: string }>;
}) {
  const session = await auth();
  const { botId } = await params;
  const ownerId = session?.user?.id ? await getEffectiveOwnerId(session.user.id) : "";
  const bot = await prisma.Bot.findFirst({
    where: { id: botId, userId: ownerId },
    include: {
      source: true,
      _count: { select: { chunk: true, chat: true, lead: true } }}});

  if (!bot) notFound();

  // Ensure bot has a publicKey for widget (backfill if missing)
  let publicKey = bot.publicKey;
  if (!publicKey) {
    publicKey = generateBotPublicKey();
    await prisma.Bot.update({
      where: { id: bot.id },
      data: { publicKey }});
  }

  const owner = session?.user?.id
    ? await prisma.User.findUnique({
        where: { id: ownerId },
        select: { removeBrandingAddOn: true }})
    : null;
  const hasRemoveBrandingAddOn = owner?.removeBrandingAddOn ?? false;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const embedCode = `<script src="${baseUrl}/widget.js" data-bot="${publicKey}" data-base="${baseUrl}"></script>`;

  return (
    <div className="px-4 py-4 sm:px-6 md:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-slate-600 transition-colors hover:text-[#1a6aff]"
      >
        ← Back to dashboard
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">{bot.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {bot._count.chunk} chunks • {bot._count.chat} chats •{" "}
            {bot._count.lead} leads
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/bots/${bot.id}/setup`}>
            <Button variant="outline">Add sources</Button>
          </Link>
          <Link href={`/dashboard/bots/${bot.id}/analytics`}>
            <Button variant="outline">Analytics</Button>
          </Link>
          <Link href={`/dashboard/bots/${bot.id}/chats`}>
            <Button variant="outline">Chat history</Button>
          </Link>
          <Link href={`/dashboard/bots/${bot.id}/leads`}>
            <Button variant="outline">Leads</Button>
          </Link>
          <Link href={`/dashboard/bots/${bot.id}/edit`}>
            <Button variant="outline">Edit behavior</Button>
          </Link>
          <DeleteBotButton botId={bot.id} botName={bot.name} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Embed code</CardTitle>
            <CardDescription>
              Add this script to your website to display the chat widget. Select your platform for step-by-step instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmbedInstructions embedCode={embedCode} />
            <BrandingToggle botId={bot.id} initialRemoveBranding={bot.removeBranding ?? false} hasAddOn={hasRemoveBrandingAddOn} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
            <CardDescription>
              Website URLs and documents used to train your bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bot.source.length === 0 ? (
              <p className="text-sm text-slate-500">No sources yet</p>
            ) : (
              <ul className="space-y-2">
                {bot.source.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <span className="truncate">
                      {s.title || s.url || s.documentUrl || "Untitled"}
                    </span>
                    <span
                      className={
                        s.status === "completed"
                          ? "text-emerald-600"
                          : s.status === "failed"
                            ? "text-rose-600"
                            : "text-slate-500"
                      }
                    >
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/dashboard/bots/${bot.id}/setup`}>
              <Button variant="ghost" size="sm" className="mt-2">
                Add more
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bot behavior</CardTitle>
          <CardDescription>Customize how your bot responds</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Greeting: {bot.greetingMessage}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Tone: {bot.tone} • Confidence threshold:{" "}
            {(bot.confidenceThreshold * 100).toFixed(0)}%
          </p>
          <Link href={`/dashboard/bots/${bot.id}/edit`}>
            <Button variant="outline" size="sm" className="mt-2">
              Edit behavior
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
