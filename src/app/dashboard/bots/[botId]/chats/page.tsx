"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  pageUrl: string | null;
  createdAt: string;
  messages: { id: string; role: string; content: string; createdAt: string }[];
}

export default function ChatsPage() {
  const params = useParams();
  const botId = params.botId as string;
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Chat | null>(null);
  const [selectedFull, setSelectedFull] = useState<Chat | null>(null);

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    q.set("limit", "50");
    fetch(`/api/bots/${botId}/chats?${q}`)
      .then((r) => r.json())
      .then((data: { chats: Chat[] }) => setChats(data.chats ?? []))
      .catch(console.error);
  }, [botId, search]);

  useEffect(() => {
    if (!selected) {
      setSelectedFull(null);
      return;
    }
    fetch(`/api/bots/${botId}/chats/${selected.id}`)
      .then((r) => r.json())
      .then((data: Chat) => setSelectedFull(data))
      .catch(() => setSelectedFull(selected));
  }, [botId, selected?.id]);

  return (
    <div className="px-4 py-4 sm:px-6 md:px-8">
      <Link
        href={`/dashboard/bots/${botId}`}
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to bot
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Chat history</h1>
        <Input
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            params.set("limit", "500");
            const r = await fetch(`/api/bots/${botId}/chats?${params}`);
            const data: { chats: Chat[] } = await r.json();
            const chatsList = data.chats ?? [];
            const rows: string[] = [
              "Date,Visitor Email,Page URL,Role,Message",
              ...chatsList.flatMap((c) =>
                c.messages.map((m) =>
                  [
                    new Date(c.createdAt).toISOString(),
                    c.visitorEmail || "",
                    c.pageUrl || "",
                    m.role,
                    '"' + (m.content || "").replace(/"/g, '""') + '"',
                  ].join(",")
                )
              ),
            ];
            const blob = new Blob([rows.join("\n")], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `chats-${botId}-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {chats.length === 0 ? (
                <p className="text-sm text-gray-500">No chats yet</p>
              ) : (
                <ul className="space-y-1">
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      onClick={() => setSelected(chat)}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                        selected?.id === chat.id
                          ? "bg-slate-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="truncate">
                        {chat.visitorName || chat.visitorEmail || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selected
                  ? selected.visitorName || selected.visitorEmail || "Unknown"
                  : "Select a chat"}
              </CardTitle>
              {selected?.pageUrl && (
                <a
                  href={selected.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm text-slate-600 hover:underline"
                >
                  {selected.pageUrl}
                </a>
              )}
            </CardHeader>
            <CardContent>
              {!selected ? (
                <p className="text-sm text-gray-500">Select a conversation</p>
              ) : !selectedFull ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : (
                <div className="space-y-4">
                  {selectedFull.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 ${
                        msg.role === "user"
                          ? "ml-4 bg-slate-100 sm:ml-8"
                          : "mr-4 bg-slate-50 sm:mr-8"
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-500">
                        {msg.role}
                      </div>
                      <div className="mt-1 text-sm">{msg.content}</div>
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
