import NextAuth, { getServerSession, NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "./generated/prisma";
import { forbidden, notFound } from "next/navigation";

const prisma = new PrismaClient();

// Fallback: allowlist from env (comma-separated)
const envAllow = (process.env.ALLOWLIST ?? "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    // Pick your providers; at least one OAuth provider
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: false,
    })
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // })
  ],
  session: { strategy: "jwt" },
  pages: {
    // signIn: "/signin",
    // error: "/auth-error" // optional
  },
  callbacks: {
    // Gate at sign-in time: only allow if email is in allowlist
    async signIn({ profile, user, account }) {
      // Prefer verified email when available
      const email =
        (user?.email ?? profile?.email ?? "").toLowerCase();

      if (!email) return false;

      // If provider exposes verification, require it (Google does; GitHub often does not)
      // If "email_verified" is present and false, block:
      // @ts-ignore
      if (typeof profile?.email_verified === "boolean" && !profile.email_verified) {
        return false;
      }

      // DB allowlist check (preferred)
      if (prisma) {
        const hit = await prisma.allowlistedEmail.findUnique({ where: { email } });
        return !!hit;
      }

      // OR env allowlist check
      return envAllow.includes(email);
    },

    // Add useful claims into the JWT (e.g., role)
    async jwt({ token }) {
      const email = (token.email ?? "").toLowerCase();
      if (prisma && email) {
        const hit = await prisma.allowlistedEmail.findUnique({ where: { email } });
        if (hit) token.role = hit.role;
      }
      return token;
    },

    async session({ session, token }) {
      // expose role/approved on session
      // @ts-ignore
      session.user.role = token.role ?? "USER";
      return session;
    },
  },
}

export const nextauth = NextAuth(authOptions);

export async function requireAdminRole() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (session?.user?.role !== "ADMIN") {
    forbidden();
  }
}

export async function isAdminUser() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  return session?.user?.role === "ADMIN";
}