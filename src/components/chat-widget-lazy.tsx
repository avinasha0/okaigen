"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);

export function ChatWidgetLazy({ botKey }: { botKey: string }) {
  if (!botKey) return null;
  return <ChatWidget botKey={botKey} />;
}
