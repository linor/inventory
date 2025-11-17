import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id || id.length === 0 || isNaN(Number(id))) {
        notFound();
    }
    
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { keys: true }
    });

    if (!category) {
        notFound();
    }

    return new Response(JSON.stringify(category));
}