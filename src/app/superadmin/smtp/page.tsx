"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SmtpConfigForm = {
  host: string;
  port: string;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
};

export default function SuperadminSmtpPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
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
      if (!res.ok) {
        throw new Error(json.error || "Save failed");
      }
      setSuccess("Saved SMTP settings.");
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
    return <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Superadmin — SMTP</h1>
        <p className="mt-0.5 text-sm text-slate-500">Configure SMTP for all outgoing emails.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SMTP settings</CardTitle>
          <CardDescription>
            These settings are stored in the database. Password is encrypted at rest.{" "}
            {hasPassword ? "Password is set." : "Password is not set."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input id="host" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input id="port" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secure">Secure (TLS)</Label>
              <select
                id="secure"
                value={form.secure ? "true" : "false"}
                onChange={(e) => setForm({ ...form, secure: e.target.value === "true" })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="false">false (STARTTLS on 587)</option>
                <option value="true">true (SMTPS on 465)</option>
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
              <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="hello@yourdomain.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (leave blank to keep)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={hasPassword ? "•••••••• (unchanged)" : "Enter password"}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={saving || !form.host.trim() || !form.port.trim()}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          {(error || success) && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
              {error && <p className="text-red-700">{error}</p>}
              {success && <p className="text-emerald-700">{success}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test SMTP</CardTitle>
          <CardDescription>Sends a test email using the saved settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testTo">Send test email to</Label>
            <Input id="testTo" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button onClick={test} disabled={testing || !testTo.trim()}>
            {testing ? "Sending..." : "Send test"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

