import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { verifyRecaptchaToken } from "./recaptcha";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Verify reCAPTCHA first, but only fail if it's actually required and invalid
        const recaptchaResult = await verifyRecaptchaToken(
          credentials.recaptchaToken as string | undefined
        );
        if (!recaptchaResult.success) {
          // Log the error for debugging but don't expose it to user
          console.error("reCAPTCHA verification failed:", recaptchaResult.error);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: { id: true, email: true, name: true, image: true, emailVerified: true, password: true },
        });

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
          hasPassword: true,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
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
    },
  },
});
