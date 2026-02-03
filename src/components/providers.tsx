"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_ENABLED = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = <SessionProvider>{children}</SessionProvider>;

  // Always render the provider to prevent hook errors, but only pass key if enabled
  // This allows useGoogleReCaptcha hook to work even when reCAPTCHA is disabled
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_ENABLED && RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : ""}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {content}
    </GoogleReCaptchaProvider>
  );
}
