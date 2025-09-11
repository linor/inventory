import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SignOutButton from "./components/sign-out-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory",
  description: "Keep track of your stuff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <header className="flex items-center justify-between border-b p-4">
            <div className="font-semibold">My App</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{session?.user?.email}</span>
              <SignOutButton />
            </div>
          </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

