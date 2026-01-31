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
import { Button } from "@/components/ui/button";

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  pageUrl: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function LeadsPage() {
  const params = useParams();
  const botId = params.botId as string;
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetch(`/api/bots/${botId}/leads`)
      .then((r) => r.json())
      .then(setLeads)
      .catch(console.error);
  }, [botId]);

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
      fetch(`/api/bots/${botId}/leads`).then((r) => r.json()).then(setLeads).catch(console.error);
      console.error("Failed to update lead status:", res.status, err);
    }
  }

  function exportCsv() {
    const rows = [
      "Date,Email,Name,Phone,Page URL",
      ...leads.map((l) =>
        [
          new Date(l.createdAt).toISOString(),
          l.email,
          (l.name || "").replace(/"/g, '""'),
          l.phone || "",
          (l.pageUrl || "").replace(/"/g, '""'),
        ].map((c) => `"${c}"`).join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${botId}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
      <Link
        href={`/dashboard/bots/${botId}`}
        className="mb-6 inline-block text-sm text-slate-600 transition-colors hover:text-[#1a6aff]"
      >
        ← Back to bot
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Captured leads</h1>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={leads.length === 0}>
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leads from chat widget</CardTitle>
          <p className="text-sm text-slate-500">
            Contact details submitted when visitors requested follow-up
          </p>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {leads.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No leads captured yet</p>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="space-y-3 md:hidden">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm"
                  >
                    <p className="mb-2 text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleString()}
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
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Phone</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 text-slate-600">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
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
