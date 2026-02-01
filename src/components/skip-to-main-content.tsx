"use client";

/**
 * Skip link for keyboard users: first focusable element, jumps to main content.
 * Visually hidden until focused (WCAG 2.4.1 Bypass Blocks).
 */
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-lg border-2 border-[#1a6aff] bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition-transform focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
