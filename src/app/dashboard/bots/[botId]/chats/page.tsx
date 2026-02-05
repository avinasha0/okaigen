"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  pageUrl: string | null;
  createdAt: string;
  messages?: { id: string; role: string; content: string; createdAt: string }[];
  chatmessage?: { id: string; role: string; content: string; createdAt: string }[];
}

export default function ChatsPage() {
  const params = useParams();
  const botId = params.botId as string;
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Chat | null>(null);
  const [selectedFull, setSelectedFull] = useState<Chat | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    q.set("limit", "50");
    q.set("ts", String(Date.now()));
    fetch(`/api/bots/${botId}/chats?${q}`)
      .then((r) => r.json())
      .then((data: { chats: Chat[]; nextCursor?: string | null }) => {
        setChats(data.chats ?? []);
        setNextCursor(data.nextCursor ?? null);
      })
      .catch(console.error);
  }, [botId, search]);

  useEffect(() => {
    const id = setInterval(() => {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      q.set("limit", "50");
      q.set("ts", String(Date.now()));
      fetch(`/api/bots/${botId}/chats?${q}`)
        .then((r) => r.json())
        .then((data: { chats: Chat[]; nextCursor?: string | null }) => {
          setChats((prev) => {
            const merged = [...data.chats, ...prev];
            const dedup = merged.filter(
              (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
            );
            return dedup;
          });
          setNextCursor(data.nextCursor ?? null);
        })
        .catch(() => {});
    }, 8000);
    return () => clearInterval(id);
  }, [botId, search]);

  useEffect(() => {
    if (!selected) {
      setSelectedFull(null);
      return;
    }
    const q = new URLSearchParams();
    q.set("ts", String(Date.now()));
    fetch(`/api/bots/${botId}/chats/${selected.id}?${q}`)
      .then((r) => r.json())
      .then((data: Chat) => {
        setSelectedFull({ ...data, messages: data.chatmessage ?? data.messages ?? [] });
        if (data.visitorName || data.visitorEmail) {
          setChats((prev) =>
            prev.map((c) =>
              c.id === selected.id
                ? {
                    ...c,
                    visitorName: data.visitorName ?? c.visitorName,
                    visitorEmail: data.visitorEmail ?? c.visitorEmail,
                  }
                : c
            )
          );
        }
      })
      .catch(() =>
        setSelectedFull(
          selected
            ? {
                ...selected,
                messages: selected.chatmessage ?? selected.messages ?? []
              }
            : null
        )
      );
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
            try {
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              params.set("limit", "500");
              const r = await fetch(`/api/bots/${botId}/chats?${params}`);
              const data: { chats: Chat[] } = await r.json();
              const chatsList = data.chats ?? [];
              const fullChats = await Promise.all(
                chatsList.map(async (c) => {
                  try {
                    const rr = await fetch(`/api/bots/${botId}/chats/${c.id}`);
                    const cd: Chat = await rr.json();
                    return {
                      ...c,
                      messages: cd?.chatmessage ?? cd?.messages ?? c.chatmessage ?? c.messages ?? [],
                    };
                  } catch {
                    return { ...c, messages: c.chatmessage ?? c.messages ?? [] };
                  }
                })
              );
              const rows: string[] = [
                "Date,Visitor Email,Page URL,Role,Message",
                ...fullChats.flatMap((c) =>
                  (c.messages ?? []).map((m) =>
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
              const blob = new Blob([rows.join("\r\n")], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `chats-${botId}-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(a.href);
            } catch (err) {
              alert("Failed to export chats. Please try again.");
              console.error(err);
            }
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
                <>
                  <ul className="space-y-1">
                    {chats.map((chat, i) => (
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
                          {chat.visitorName || chat.visitorEmail || `Visitor ${i + 1}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {nextCursor && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loadingMore}
                        onClick={async () => {
                          try {
                            setLoadingMore(true);
                            const params = new URLSearchParams();
                            if (search) params.set("search", search);
                            params.set("limit", "50");
                            params.set("cursor", nextCursor || "");
                            params.set("ts", String(Date.now()));
                            const r = await fetch(`/api/bots/${botId}/chats?${params}`);
                            const data: { chats: Chat[]; nextCursor?: string | null } = await r.json();
                            setChats((prev) => {
                              const merged = [...prev, ...(data.chats ?? [])];
                              const dedup = merged.filter(
                                (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
                              );
                              return dedup;
                            });
                            setNextCursor(data.nextCursor ?? null);
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setLoadingMore(false);
                          }
                        }}
                      >
                        {loadingMore ? "Loading..." : "Load more"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selected
                  ? selected.visitorName ||
                    selected.visitorEmail ||
                    (() => {
                      const idx = chats.findIndex((c) => c.id === selected.id);
                      return idx >= 0 ? `Visitor ${idx + 1}` : "Visitor";
                    })()
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
                  {(selectedFull.messages ?? []).map((msg, i) => (
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
