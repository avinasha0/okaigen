"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Member {
  id: string;
  email: string;
  name: string | null;
  role: string;
  joinedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

interface TeamData {
  members: Member[];
  invitations: Invitation[];
  canManage: boolean;
  usedTeamMembers: number;
  totalTeamMembers: number;
  canInvite: boolean;
  currentUserId?: string;
}

export default function TeamPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInviteLink(null);
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: inviteRole }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to send invitation");
        return;
      }
      setInviteLink(json.inviteLink ?? null);
      setInviteEmail("");
      fetch("/api/team").then((r) => r.json()).then(setData);
    } catch {
      setError("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  }

  async function removeMember(userId: string) {
    if (!confirm("Remove this team member?")) return;
    const res = await fetch(`/api/team/members/${userId}`, { method: "DELETE" });
    if (res.ok) fetch("/api/team").then((r) => r.json()).then(setData);
    else alert((await res.json()).error || "Failed to remove");
  }

  async function leaveTeam() {
    if (!data?.currentUserId) return;
    if (!confirm("Leave this team? You will lose access to this account's bots and dashboard.")) return;
    const res = await fetch(`/api/team/members/${data.currentUserId}`, { method: "DELETE" });
    if (res.ok) window.location.href = "/dashboard";
    else alert((await res.json()).error || "Failed to leave");
  }

  async function cancelInvitation(id: string) {
    const res = await fetch(`/api/team/invitations/${id}`, { method: "DELETE" });
    if (res.ok) fetch("/api/team").then((r) => r.json()).then(setData);
  }

  if (!data) {
    return (
      <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
        <div className="py-12 text-center text-sm text-slate-500">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Team</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {data.canManage
            ? "Invite team members to access your bots and dashboard."
            : "You are a team member. You have access to the account owner's bots and dashboard."}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team members</CardTitle>
            <CardDescription>
              {data.usedTeamMembers} / {data.totalTeamMembers} members used
              {data.totalTeamMembers <= 1 && " — Upgrade your plan to add team members."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.members.length === 0 ? (
              <p className="text-sm text-slate-500">No other team members yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3 first:pt-0">
                    <div>
                      <p className="font-medium text-slate-900">{m.name || m.email}</p>
                      <p className="text-sm text-slate-500">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {m.role}
                      </span>
                      {data.canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeMember(m.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!data.canManage && (
              <Button variant="outline" size="sm" onClick={leaveTeam} className="text-slate-600">
                Leave team
              </Button>
            )}
          </CardContent>
        </Card>

        {data.canManage && data.totalTeamMembers > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invite member</CardTitle>
              <CardDescription>
                Send an invite link. They must sign up or log in with the same email to accept.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data.canInvite && (
                <p className="text-sm text-amber-600">
                  Team limit reached ({data.totalTeamMembers}).{" "}
                  <Link href="/dashboard/pricing" className="font-medium text-[#1a6aff] hover:underline">
                    Upgrade
                  </Link>{" "}
                  to add more members.
                </p>
              )}
              {data.canInvite && (
                <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="teammate@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full space-y-2 sm:w-40">
                    <Label htmlFor="invite-role">Role</Label>
                    <select
                      id="invite-role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
                    {inviting ? "Sending..." : "Invite"}
                  </Button>
                </form>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {inviteLink && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
                  <p className="font-medium text-emerald-800">Invite link created</p>
                  <p className="mt-1 break-all text-emerald-700">{inviteLink}</p>
                  <p className="mt-2 text-emerald-600">Share this link with the team member. It expires in 7 days.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {data.canManage && data.invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.invitations.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="text-sm text-slate-700">{i.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Expires {new Date(i.expiresAt).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => cancelInvitation(i.id)}>
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
