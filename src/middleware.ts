import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/signup", "/pricing", "/demo", "/widget.js", "/atlas-training-content"];
const publicPrefixes = ["/api/auth", "/api/chat", "/api/embed", "/api/leads", "/api/tools", "/embed", "/uploads", "/tools"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Bot-Key, X-Atlas-Key, X-Visitor-Id, X-Page-Url",
};

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

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

  if (!req.auth?.user && path.startsWith("/api/")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!req.auth?.user) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
