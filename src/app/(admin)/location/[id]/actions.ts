"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { flashMessage } from "@thewebartisan7/next-flash-message";

export async function deleteLocationAction(id?: string) {
    if (!id) {
        await flashMessage("Invalid location ID.", "error");
        redirect("/location");
    }

    await prisma.storageLocation.delete({
        where: { id },
    });

    await flashMessage("Location deleted successfully.", "success");
    redirect("/location");
}