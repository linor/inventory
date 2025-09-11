import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // must be signed in
  },
});

export const config = {
  matcher: [
    // protect everything except NextAuth, public files, and Next.js assets
    "/((?!api/auth|_next|favicon.ico|robots.txt|sitemap.xml|public|signin).*)",
  ],
};
