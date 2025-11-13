"use server";
import { flashMessage } from "@thewebartisan7/next-flash-message";

export async function addMessage() {
    await flashMessage({
        message: "Action required",
        level: "info",
        description: "More details about this message.",
    });
}