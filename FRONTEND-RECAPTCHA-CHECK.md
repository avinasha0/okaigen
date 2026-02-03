# Frontend reCAPTCHA Status Check - Quick Guide

Simple ways to check if reCAPTCHA is enabled on the frontend.

## ✅ Method 1: Using the Hook (Best - Shows Real Status)

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function MyPage() {
  const { enabled, loading } = useRecaptchaStatus();

  return (
    <div>
      {loading ? (
        <p>Checking status...</p>
      ) : enabled ? (
        <p>✅ reCAPTCHA is ON</p>
      ) : (
        <p>❌ reCAPTCHA is OFF</p>
      )}
    </div>
  );
}
```

## ✅ Method 2: Quick Check (No Loading State)

```tsx
"use client";

import { isRecaptchaEnabledClient } from "@/hooks/use-recaptcha-status";

export default function MyPage() {
  const enabled = isRecaptchaEnabledClient();
  
  return (
    <div>
      {enabled ? "reCAPTCHA: ON" : "reCAPTCHA: OFF"}
    </div>
  );
}
```

## ✅ Method 3: Direct Env Check (Simplest)

```tsx
"use client";

export default function MyPage() {
  const enabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";
  
  return <p>Status: {enabled ? "Enabled" : "Disabled"}</p>;
}
```

## ✅ Method 4: Using the Badge Component

```tsx
"use client";

import { RecaptchaStatusBadge } from "@/components/recaptcha-status-badge";

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <RecaptchaStatusBadge />
      {/* Rest of your page */}
    </div>
  );
}
```

## Real-World Examples

### Example 1: Show Status in Header

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export function Header() {
  const { enabled } = useRecaptchaStatus();
  
  return (
    <header>
      <nav>
        {/* Your nav items */}
      </nav>
      {enabled && (
        <span className="text-xs text-gray-500">
          🔒 Protected by reCAPTCHA
        </span>
      )}
    </header>
  );
}
```

### Example 2: Conditional Message

```tsx
"use client";

import { isRecaptchaEnabledClient } from "@/hooks/use-recaptcha-status";

export default function ContactPage() {
  const enabled = isRecaptchaEnabledClient();
  
  return (
    <form>
      <h1>Contact Us</h1>
      {enabled && (
        <p className="text-sm text-gray-500 mb-4">
          This form is protected by Google reCAPTCHA
        </p>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Example 3: Debug Info (Development)

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function DebugPage() {
  const { enabled, loading } = useRecaptchaStatus();
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2>reCAPTCHA Status</h2>
      <p>Loading: {loading ? "Yes" : "No"}</p>
      <p>Enabled: {enabled ? "Yes" : "No"}</p>
      <p>Env Check: {process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Which Method to Use?

- **`useRecaptchaStatus()`** → When you need accurate status (checks DB + env) with loading state
- **`isRecaptchaEnabledClient()`** → Quick check without API call (env only)
- **Direct env check** → Simplest, fastest (env only)
- **Badge component** → Ready-to-use UI component

## Quick Copy-Paste Template

```tsx
"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

export default function YourPage() {
  const { enabled, loading } = useRecaptchaStatus();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Your content */}
      {enabled && <p>🔒 Protected by reCAPTCHA</p>}
    </div>
  );
}
```
