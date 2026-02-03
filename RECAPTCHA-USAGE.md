# reCAPTCHA Status Checking Guide

This guide shows how to check if reCAPTCHA is enabled on any page (client-side or server-side).

## Client-Side (React Components)

### Option 1: Using the Hook (Recommended - Gets DB + Env Status)

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function MyPage() {
  const { enabled, loading } = useRecaptchaStatus();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {enabled ? (
        <p>reCAPTCHA is enabled</p>
      ) : (
        <p>reCAPTCHA is disabled</p>
      )}
    </div>
  );
}
```

### Option 2: Simple Env Check (Fast, No API Call)

```tsx
"use client";

import { isRecaptchaEnabledClient } from "@/hooks/use-recaptcha-status";

export default function MyPage() {
  const enabled = isRecaptchaEnabledClient();

  return (
    <div>
      {enabled ? (
        <p>reCAPTCHA is enabled (env check)</p>
      ) : (
        <p>reCAPTCHA is disabled (env check)</p>
      )}
    </div>
  );
}
```

### Option 3: Direct Env Check (Simplest)

```tsx
"use client";

export default function MyPage() {
  const enabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

  return (
    <div>
      {enabled ? (
        <p>reCAPTCHA is enabled</p>
      ) : (
        <p>reCAPTCHA is disabled</p>
      )}
    </div>
  );
}
```

## Server-Side (Server Components & API Routes)

### Option 1: Using the Utility Function (Checks Env + DB)

```tsx
import { isRecaptchaEnabled } from "@/lib/recaptcha";

export default async function MyServerPage() {
  const enabled = await isRecaptchaEnabled();

  return (
    <div>
      {enabled ? (
        <p>reCAPTCHA is enabled</p>
      ) : (
        <p>reCAPTCHA is disabled</p>
      )}
    </div>
  );
}
```

### Option 2: In API Routes

```ts
import { NextResponse } from "next/server";
import { isRecaptchaEnabled } from "@/lib/recaptcha";

export async function GET() {
  const enabled = await isRecaptchaEnabled();
  
  return NextResponse.json({ 
    enabled,
    message: enabled ? "reCAPTCHA is active" : "reCAPTCHA is disabled"
  });
}
```

## Examples

### Example 1: Conditional UI Rendering

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function ContactForm() {
  const { enabled } = useRecaptchaStatus();

  return (
    <form>
      {/* Form fields */}
      
      {enabled && (
        <p className="text-xs text-gray-500">
          Protected by reCAPTCHA
        </p>
      )}
    </form>
  );
}
```

### Example 2: Show Admin Status

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function AdminDashboard() {
  const { enabled, loading } = useRecaptchaStatus();

  if (loading) return <div>Loading status...</div>;

  return (
    <div className="p-4 border rounded">
      <h2>Security Status</h2>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span>reCAPTCHA: {enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    </div>
  );
}
```

### Example 3: Server Component with Status

```tsx
import { isRecaptchaEnabled } from "@/lib/recaptcha";

export default async function SettingsPage() {
  const recaptchaEnabled = await isRecaptchaEnabled();

  return (
    <div>
      <h1>Settings</h1>
      <div className="mb-4">
        <p>reCAPTCHA Status: {recaptchaEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
      </div>
      {/* Rest of settings */}
    </div>
  );
}
```

## Summary

- **Client-side with DB check**: Use `useRecaptchaStatus()` hook (includes loading state)
- **Client-side quick check**: Use `isRecaptchaEnabledClient()` or direct env check
- **Server-side**: Use `isRecaptchaEnabled()` function (checks env + DB)

## Notes

- The hook (`useRecaptchaStatus`) makes an API call to get the most accurate status (env + DB)
- Direct env checks are faster but only check `NEXT_PUBLIC_RECAPTCHA_ENABLED`
- Server-side `isRecaptchaEnabled()` checks both env and database settings
- All methods are safe and won't break if reCAPTCHA is disabled
