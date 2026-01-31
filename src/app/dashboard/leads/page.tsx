"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

interface Lead {
  id: string;
  botId: string;
  botName: string;
  email: string;
  name: string | null;
  phone: string | null;
  pageUrl: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterBot, setFilterBot] = useState<string>("");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then(setLeads)
      .catch(console.error);
  }, []);

  const bots = [...new Set(leads.map((l) => ({ id: l.botId, name: l.botName })))].filter(
    (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i
  );
  const filtered = filterBot
    ? leads.filter((l) => l.botId === filterBot)
    : leads;

  async function updateStatus(leadId: string, status: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      fetch("/api/leads").then((r) => r.json()).then(setLeads).catch(console.error);
      console.error("Failed to update lead status:", res.status, err);
    }
  }

  function exportCsv() {
    const rows = [
      "Date,Bot,Email,Name,Phone,Status,Page URL",
      ...filtered.map((l) =>
        [
          new Date(l.createdAt).toISOString(),
          (l.botName || "").replace(/"/g, '""'),
          l.email,
          (l.name || "").replace(/"/g, '""'),
          l.phone || "",
          (l.status || "new").replace(/"/g, '""'),
          (l.pageUrl || "").replace(/"/g, '""'),
        ]
          .map((c) => `"${c}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Leads</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Contact details captured from chat widgets
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {bots.length > 1 && (
            <select
              value={filterBot}
              onChange={(e) => setFilterBot(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
            >
              <option value="">All bots</option>
              {bots.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Captured leads</CardTitle>
          <p className="text-sm text-slate-500">
            Visitors who submitted their contact when the bot offered follow-up
          </p>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              {leads.length === 0 ? "No leads captured yet" : "No leads for this bot"}
            </p>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="space-y-3 md:hidden">
                {filtered.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm"
                  >
                    <p className="mb-2 text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleString()}
                      {bots.length > 1 && (
                        <> · <Link href={`/dashboard/bots/${lead.botId}/leads`} className="text-[#1a6aff] hover:underline">{lead.botName}</Link></>
                      )}
                    </p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="block break-all font-medium text-[#1a6aff] hover:underline"
                    >
                      {lead.email}
                    </a>
                    {(lead.name || lead.phone) && (
                      <p className="mt-1 text-slate-600">
                        {lead.name && <span>{lead.name}</span>}
                        {lead.name && lead.phone && " · "}
                        {lead.phone && <span>{lead.phone}</span>}
                      </p>
                    )}
                    {lead.pageUrl && (
                      <a
                        href={lead.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate text-xs text-[#1a6aff] hover:underline"
                        title={lead.pageUrl}
                      >
                        {lead.pageUrl}
                      </a>
                    )}
                    <div className="mt-2">
                      <select
                        value={lead.status || "new"}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      {bots.length > 1 && <th className="pb-3 pr-4 font-medium">Bot</th>}
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Phone</th>
                      <th className="pb-3 font-medium">Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 text-slate-600">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        {bots.length > 1 && (
                          <td className="py-3 pr-4">
                            <Link
                              href={`/dashboard/bots/${lead.botId}/leads`}
                              className="text-[#1a6aff] hover:underline"
                            >
                              {lead.botName}
                            </Link>
                          </td>
                        )}
                        <td className="py-3 pr-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[#1a6aff] hover:underline"
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-3 pr-4 text-slate-700">{lead.name || "—"}</td>
                        <td className="py-3 pr-4 text-slate-700">{lead.phone || "—"}</td>
                        <td className="py-3 pr-4">
                          <select
                            value={lead.status || "new"}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="max-w-[200px] py-3">
                          {lead.pageUrl ? (
                            <a
                              href={lead.pageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate text-[#1a6aff] hover:underline"
                              title={lead.pageUrl}
                            >
                              {lead.pageUrl}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
