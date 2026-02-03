"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";
import { useState } from "react";

export default function ChatbotROICalculatorPage() {
  const [tickets, setTickets] = useState(500);
  const [cost, setCost] = useState(15);
  const [rate, setRate] = useState(30);
  const deflected = Math.round((tickets * rate) / 100);
  const monthly = deflected * cost;
  const yearly = monthly * 12;

  return (
    <ToolPageLayout title="Chatbot ROI Calculator" description="Estimate savings from AI chatbot." breadcrumbTitle="Chatbot ROI Calculator" currentPath="/tools/chatbot-roi-calculator" otherTools={ALL_SEO_TOOLS}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="block text-sm font-medium">Tickets/month</label><input type="number" value={tickets} onChange={(e) => setTickets(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Cost per ticket</label><input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Deflection %</label><input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
        </div>
        <div className="rounded-xl border bg-slate-50 p-6">
          <p className="font-semibold">Monthly savings: ${monthly.toLocaleString('en-US')}</p>
          <p className="font-semibold">Yearly savings: ${yearly.toLocaleString('en-US')}</p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
