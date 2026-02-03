import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/pricing", "/demo", "/contact", "/integration", "/terms", "/privacy", "/refund", "/widget.js", "/atlas-training-content"];
const publicPrefixes = ["/api/auth", "/api/chat", "/api/contact", "/api/embed", "/api/leads", "/api/stripe/webhook", "/api/razorpay/webhook", "/api/paypal/webhook", "/api/tools", "/embed", "/uploads", "/tools", "/docs"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Bot-Key, X-Atlas-Key, X-Visitor-Id, X-Page-Url"};

// Content Security Policy
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "frame-src 'self' https://www.google.com",
  "connect-src 'self' https://www.google.com https://www.google.com/recaptcha/api/siteverify",
].join("; ");

function hasSession(req: NextRequest): boolean {
  const cookie = req.cookies.get("authjs.session-token") ?? req.cookies.get("__Secure-authjs.session-token") ?? req.cookies.get("next-auth.session-token") ?? req.cookies.get("__Secure-next-auth.session-token");
  return !!cookie?.value;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const response = NextResponse.next();

  // Add CSP header
  response.headers.set("Content-Security-Policy", cspHeader);

  // Handle OPTIONS for CORS routes
  if (path.startsWith("/api/chat") || path.startsWith("/api/embed") || path.startsWith("/api/leads")) {
    if (req.method === "OPTIONS") {
      const res = new NextResponse(null, { status: 204, headers: corsHeaders });
      res.headers.set("Content-Security-Policy", cspHeader);
      return res;
    }
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // Ensure OPTIONS requests for API routes pass through
  if (path.startsWith("/api/") && req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Content-Security-Policy", cspHeader);
    return res;
  }

  const isPublic =
    publicPaths.includes(path) ||
    publicPrefixes.some((p) => path.startsWith(p));

  if (isPublic) return response;

  if (!hasSession(req) && path.startsWith("/api/")) {
    const res = Response.json({ error: "Unauthorized" }, { status: 401 });
    res.headers.set("Content-Security-Policy", cspHeader);
    return res;
  }
  if (!hasSession(req)) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.headers.set("Content-Security-Policy", cspHeader);
    return res;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]};
