"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

type AvatarId = "friendly" | "cartoon" | "robot" | "influencer";
type Viseme = "closed" | "open" | "rounded" | "teeth" | "smile";

function getWordAtCharIndex(text: string, charIndex: number) {
  // SpeechSynthesis boundary events provide `charIndex` into the original string.
  let i = Math.max(0, Math.min(text.length, charIndex));
  // Expand left/right while the chars look like part of a word.
  while (i > 0 && /[A-Za-z0-9']/u.test(text[i - 1])) i -= 1;
  let j = i;
  while (j < text.length && /[A-Za-z0-9']/u.test(text[j])) j += 1;
  return text.slice(i, j);
}

function tokenToViseme(tokenRaw: string): Viseme {
  const token = tokenRaw.trim().toLowerCase();
  if (!token) return "closed";

  // Very rough phoneme/viseme heuristic for natural-ish mouth motion.
  if (/[bmp]/.test(token)) return "closed";
  if (/[fv]/.test(token)) return "teeth";
  if (/[oouw]/.test(token)) return "rounded";
  if (/[aei]/.test(token)) return "open";
  if (/[lr]/.test(token)) return "smile";
  if (/[stz]/.test(token)) return "teeth";
  if (/[0-9]/.test(token)) return "open";
  return "open";
}

function LipSyncAvatar({
  avatarId,
  viseme,
  speaking,
}: {
  avatarId: AvatarId;
  viseme: Viseme;
  speaking: boolean;
}) {
  const theme = useMemo(() => {
    switch (avatarId) {
      case "influencer":
        return { skin: "#ffd7c2", accent: "#7c3aed", eye: "#2b1b1b" };
      case "robot":
        return { skin: "#c7f3ff", accent: "#1a6aff", eye: "#0b3b66" };
      case "cartoon":
        return { skin: "#ffe1c7", accent: "#ef4444", eye: "#3b2f2f" };
      case "friendly":
      default:
        return { skin: "#f3d7ff", accent: "#10b981", eye: "#2f2a2a" };
    }
  }, [avatarId]);

  const mouth = useMemo(() => {
    // Map viseme -> a mouth "openness" and style.
    switch (viseme) {
      case "closed":
        return { h: 4, r: 6, y: 0, rot: 0, opacity: speaking ? 0.9 : 0.85 };
      case "teeth":
        return { h: 8, r: 10, y: -1, rot: -2, opacity: 0.98 };
      case "rounded":
        return { h: 10, r: 999, y: -1, rot: 2, opacity: 0.98 };
      case "smile":
        return { h: 7, r: 10, y: 0, rot: 3, opacity: 0.98 };
      case "open":
      default:
        return { h: 14, r: 14, y: -2, rot: 0, opacity: 1 };
    }
  }, [viseme, speaking]);

  const mouthTop = avatarId === "influencer" ? 126 : 138;
  const mouthBg = avatarId === "influencer"
    ? "rgba(0,0,0,0.42)"
    : "rgba(15,23,42,0.85)";

  return (
    <div className="relative mx-auto h-[220px] w-full max-w-[360px]">
      {avatarId === "influencer" ? (
        <div
          className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <img
            src="/api/ai-ugc-generator/influencer-image"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${theme.skin}, ${theme.skin} 35%, rgba(15,23,42,0.04) 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Eyes (hide for photo avatar) */}
      {avatarId !== "influencer" && (
        <div className="absolute left-1/2 top-[74px] flex w-24 -translate-x-1/2 justify-between px-6">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: theme.eye, boxShadow: `0 0 0 4px rgba(255,255,255,0.55)` }}
          />
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: theme.eye, boxShadow: `0 0 0 4px rgba(255,255,255,0.55)` }}
          />
        </div>
      )}

      {/* Antenna / accents (hide for photo avatar) */}
      {avatarId === "robot" && (
        <div className="absolute left-1/2 top-2 h-10 w-3 -translate-x-1/2 rounded-full" style={{ background: theme.accent }}>
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: theme.accent }} />
        </div>
      )}

      {/* Mouth */}
      <div
        className="absolute left-1/2 flex h-6 w-20 -translate-x-1/2 items-center justify-center"
        aria-hidden="true"
        style={{ top: mouthTop }}
      >
        <div
          className="transition-[height,border-radius,transform,opacity] duration-120 ease-out"
          style={{
            height: mouth.h,
            width: avatarId === "robot" ? 26 : 34,
            borderRadius: mouth.r,
            background: mouthBg,
            transform: `translateY(${mouth.y}px) rotate(${mouth.rot}deg)`,
            opacity: mouth.opacity,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.08) inset`,
          }}
        />
      </div>

      {/* Small accent line (hide for photo avatar) */}
      {avatarId !== "influencer" && (
        <div
          className="absolute left-1/2 top-[118px] h-1 w-16 -translate-x-1/2 rounded-full"
          style={{ background: theme.accent, opacity: 0.25 }}
        />
      )}
    </div>
  );
}

function AvatarPicker({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AvatarId;
  onChange: (v: AvatarId) => void;
}) {
  const options: { id: AvatarId; title: string; subtitle: string }[] = [
    { id: "friendly", title: "Friendly", subtitle: "Soft colors, natural motion" },
    { id: "cartoon", title: "Cartoon", subtitle: "Bold accents, playful look" },
    { id: "robot", title: "Robot", subtitle: "Tech style, sync-friendly" },
    { id: "influencer", title: "Influencer", subtitle: "Modern look, soft highlight" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-slate-900">Add avatar</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-600">
            Pick a built-in avatar. It will lip-sync while the generated speech plays.
          </Dialog.Description>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  onOpenChange(false);
                }}
                className={[
                  "rounded-lg border p-4 text-left transition-colors hover:bg-slate-50",
                  opt.id === value ? "border-[#1a6aff] bg-[#1a6aff]/5" : "border-slate-200 bg-white",
                ].join(" ")}
              >
                <div className="text-sm font-semibold text-slate-900">{opt.title}</div>
                <div className="mt-1 text-xs text-slate-600">{opt.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Done
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function AiUgcGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"text" | "tts">("tts");
  const [text, setText] = useState("Check out this new product! It’s fast, friendly, and built for you.");

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarId, setAvatarId] = useState<AvatarId>("friendly");

  const [speaking, setSpeaking] = useState(false);
  const [viseme, setViseme] = useState<Viseme>("closed");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices?.() ?? [];
      // Sort by language/name for a nicer selector.
      setVoiceOptions([...voices].sort((a, b) => (a.lang + a.name).localeCompare(b.lang + b.name)));
      if (!voiceName && voices.length) setVoiceName(voices[0].name);
    };
    loadVoices();
    // Some browsers load voices asynchronously.
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setViseme("closed");
  }, []);

  const generateVoice = useCallback(() => {
    if (typeof window === "undefined") return;
    const t = text.trim();
    if (!t) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(t);
    utteranceRef.current = utterance;

    const voice = voiceOptions.find((v) => v.name === voiceName);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setSpeaking(true);
      setViseme("closed");
    };
    utterance.onend = () => {
      setSpeaking(false);
      setViseme("closed");
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setViseme("closed");
    };

    // Drive lip-sync from word boundaries (best-effort across browsers).
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      const e = event as unknown as { name?: string; charIndex?: number };
      const charIndex = typeof e.charIndex === "number" ? e.charIndex : 0;

      // We only need a token to choose a viseme; use the token at boundary index.
      const token = getWordAtCharIndex(t, charIndex);
      const next = tokenToViseme(token);
      setViseme(next);
    };

    window.speechSynthesis.speak(utterance);
  }, [pitch, rate, stopSpeaking, text, voiceName, voiceOptions]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI UGC Generator</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create UGC-style voiceovers with lip-sync. (Best effort lip sync using your browser TTS.)
          </p>
        </div>
        <div className="hidden sm:block">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Browse AI tools
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          {/* Simple “tab” UI */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={[
                "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                activeTab === "text" ? "border-[#1a6aff] bg-[#1a6aff]/5 text-[#0d5aeb]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tts")}
              className={[
                "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                activeTab === "tts" ? "border-[#1a6aff] bg-[#1a6aff]/5 text-[#0d5aeb]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              Text to speech
            </button>
          </div>

          {activeTab !== "tts" ? (
            <div>
              <div className="text-sm font-semibold text-slate-900">Your script</div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-3 h-40 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("tts")}
                  className="rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
                >
                  Continue to voice
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Text to speech</div>
                  <div className="mt-1 text-xs text-slate-600">Add an avatar, then generate voice and watch the lip-sync.</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAvatarOpen(true)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Add avatar
                  </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-4 h-40 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                placeholder="Type your script here..."
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Voice</label>
                  <select
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                    disabled={voiceOptions.length === 0}
                  >
                    {voiceOptions.length === 0 ? (
                      <option value="">Loading voices…</option>
                    ) : (
                      voiceOptions.map((v) => (
                        <option key={`${v.name}-${v.lang}`} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="block text-xs font-semibold text-slate-700">Rate</label>
                    <div className="text-xs text-slate-500">{rate.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min={0.7}
                    max={1.3}
                    step={0.01}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="mt-1 w-full"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="block text-xs font-semibold text-slate-700">Pitch</label>
                    <div className="text-xs text-slate-500">{pitch.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min={0.7}
                    max={1.3}
                    step={0.01}
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={generateVoice}
                  disabled={!text.trim() || speaking}
                  className="rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb] disabled:opacity-50"
                >
                  {speaking ? "Speaking…" : "Generate voice"}
                </button>
                <button
                  type="button"
                  onClick={stopSpeaking}
                  disabled={!speaking}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Stop
                </button>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Tip: If lip sync feels slightly off on your browser, tell me your browser name/version and I’ll tune the viseme mapping.
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-amber-900">About lip sync</div>
            <p className="mt-1 text-sm text-amber-800">
              This demo uses best-effort word-boundary events from the browser’s built-in text-to-speech. For true “natural” visemes,
              we’d generate audio + phoneme timing from a dedicated TTS provider.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Avatar preview</div>
              <div className="mt-1 text-xs text-slate-600">{avatarId}</div>
            </div>
            <button
              type="button"
              onClick={() => setAvatarOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Change
            </button>
          </div>

          <div className="mt-4">
            <LipSyncAvatar avatarId={avatarId} viseme={viseme} speaking={speaking} />
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Lip sync state: <span className="font-semibold text-slate-700">{speaking ? viseme : "idle"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/tools"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Browse AI tools
        </Link>
      </div>

      <AvatarPicker open={avatarOpen} onOpenChange={setAvatarOpen} value={avatarId} onChange={setAvatarId} />
    </div>
  );
}

