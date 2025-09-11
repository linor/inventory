"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
      aria-label="Sign out"
    >
      Log out
    </button>
  );
}