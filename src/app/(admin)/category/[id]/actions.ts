"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { flashMessage } from "@thewebartisan7/next-flash-message";

export async function deleteCategoryAction(id?: number) {
    if (!id) {
        await flashMessage("Invalid category ID.", "error");
        redirect("/category");
    }

    await prisma.category.delete({
        where: { id },
    });

    await flashMessage("Category deleted successfully.", "success");
    redirect("/category");
}