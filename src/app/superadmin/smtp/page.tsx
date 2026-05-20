"use client";

import { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SuperadminPageHeader } from "@/components/superadmin/page-header";
import { SuperadminAlertBanner } from "@/components/superadmin/alert-banner";

type SmtpConfigForm = {
  host: string;
  port: string;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
};

const selectClassName = cn(
  "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2"
);

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-zinc-200" />
      <div className="h-64 rounded-xl bg-zinc-100" />
      <div className="h-40 rounded-xl bg-zinc-100" />
    </div>
  );
}

export default function SuperadminSmtpPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [testTo, setTestTo] = useState("");

  const [form, setForm] = useState<SmtpConfigForm>({
    host: "",
    port: "587",
    secure: false,
    username: "",
    password: "",
    fromEmail: "",
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/superadmin/smtp")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to load");
        return r.json();
      })
      .then((json) => {
        if (!mounted) return;
        setHasPassword(!!json.hasPassword);
        const cfg = json.config;
        if (cfg) {
          setForm((f) => ({
            ...f,
            host: cfg.host ?? "",
            port: String(cfg.port ?? "587"),
            secure: !!cfg.secure,
            username: cfg.username ?? "",
            fromEmail: cfg.fromEmail ?? "",
            password: "",
          }));
        }
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const portNum = Number(form.port);
      const res = await fetch("/api/superadmin/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: form.host.trim(),
          port: portNum,
          secure: form.secure,
          username: form.username.trim() || null,
          password: form.password.trim() || null,
          fromEmail: form.fromEmail.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSuccess("SMTP settings saved successfully.");
      if (form.password.trim()) setHasPassword(true);
      setForm((f) => ({ ...f, password: "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function test() {
    setError("");
    setSuccess("");
    setTesting(true);
    try {
      const to = testTo.trim();
      const res = await fetch("/api/superadmin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.details ? `${json.error}: ${json.details}` : json.error || "Test failed");
      }
      setSuccess(`Test email sent to ${to}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <SuperadminPageHeader
        title="SMTP & email"
        description="Configure the mail server used for verification emails, notifications, and system messages."
        breadcrumbs={[
          { label: "Superadmin", href: "/superadmin" },
          { label: "SMTP" },
        ]}
      />

      {(error || success) && (
        <div className="mb-6 space-y-3">
          {error ? <SuperadminAlertBanner variant="error" message={error} /> : null}
          {success ? <SuperadminAlertBanner variant="success" message={success} /> : null}
        </div>
      )}

      <Card className="border-zinc-200/80 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Server settings</CardTitle>
              <CardDescription>
                Stored in the database. Password is encrypted at rest.{" "}
                <span className={hasPassword ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {hasPassword ? "Password configured." : "No password set."}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secure">Security</Label>
              <select
                id="secure"
                value={form.secure ? "true" : "false"}
                onChange={(e) => setForm({ ...form, secure: e.target.value === "true" })}
                className={selectClassName}
              >
                <option value="false">STARTTLS (port 587)</option>
                <option value="true">SMTPS / TLS (port 465)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From email</Label>
              <Input
                id="fromEmail"
                value={form.fromEmail}
                onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                placeholder="noreply@yourdomain.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="hello@yourdomain.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={hasPassword ? "Leave blank to keep current" : "Enter password"}
              />
            </div>
          </div>

          <Button onClick={save} disabled={saving || !form.host.trim() || !form.port.trim()}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 border-zinc-200/80 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Delivery test</CardTitle>
              <CardDescription>Send a test message using the saved SMTP configuration.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="max-w-md space-y-2">
            <Label htmlFor="testTo">Recipient email</Label>
            <Input
              id="testTo"
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button variant="outline" onClick={test} disabled={testing || !testTo.trim()}>
            {testing ? "Sending…" : "Send test email"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
