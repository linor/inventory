"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { flashMessage } from "@thewebartisan7/next-flash-message";

export async function deleteItemAction(id?: string) {
    if (!id) {
        await flashMessage("Invalid item ID.", "error");
        redirect("/item");
    }
    
    await prisma.item.delete({
        where: { id },
    });

    await flashMessage("Item deleted successfully.", "success");
    redirect("/item");
}