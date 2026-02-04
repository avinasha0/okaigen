import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // Allow sign-in when request host is www vs non-www (e.g. www.sitebotgpt.com)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login"},
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!}),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }},
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: { id: true, email: true, name: true, image: true, emailVerified: true, password: true }});

        if (!user?.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          hasPassword: true};
      }}),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.id) {
        await prisma.user.updateMany({
          where: { id: user.id, emailVerified: null },
          data: { emailVerified: new Date() }});
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        const u = user as { emailVerified?: Date | null; hasPassword?: boolean };
        if (account?.provider === "credentials") {
          token.emailVerified = u.emailVerified?.toISOString() ?? null;
          token.hasPassword = true;
        } else {
          token.emailVerified = u.emailVerified?.toISOString() ?? new Date().toISOString();
          token.hasPassword = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified ? new Date(token.emailVerified as string) : null;
        session.user.hasPassword = token.hasPassword as boolean;
      }
      return session;
    }}});
