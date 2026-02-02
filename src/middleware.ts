import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/pricing", "/demo", "/contact", "/integration", "/terms", "/privacy", "/refund", "/widget.js", "/atlas-training-content"];
const publicPrefixes = ["/api/auth", "/api/chat", "/api/contact", "/api/embed", "/api/leads", "/api/stripe/webhook", "/api/razorpay/webhook", "/api/paypal/webhook", "/api/tools", "/embed", "/uploads", "/tools", "/docs"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Bot-Key, X-Atlas-Key, X-Visitor-Id, X-Page-Url",
};

function hasSession(req: NextRequest): boolean {
  const cookie = req.cookies.get("authjs.session-token") ?? req.cookies.get("__Secure-authjs.session-token") ?? req.cookies.get("next-auth.session-token") ?? req.cookies.get("__Secure-next-auth.session-token");
  return !!cookie?.value;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/chat") || path.startsWith("/api/embed") || path.startsWith("/api/leads")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }
    const res = NextResponse.next();
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  const isPublic =
    publicPaths.includes(path) ||
    publicPrefixes.some((p) => path.startsWith(p));

  if (isPublic) return NextResponse.next();

  if (!hasSession(req) && path.startsWith("/api/")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSession(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
