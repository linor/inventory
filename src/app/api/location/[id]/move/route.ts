import { StorageLocation } from "@/generated/prisma/wasm";
import prisma from "@/lib/prisma";


export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!id || !parentId) {
        return new Response(JSON.stringify({ error: "Missing id or parentId" }), { status: 400 });
    }

    const location = await prisma.storageLocation.findUnique({
        where: { id },
    });

    if (!location) {
        return new Response(JSON.stringify({ error: "Location not found" }), { status: 404 });
    }

    if (location.parentId === parentId) {
        return new Response(JSON.stringify({ error: "Location is already in the target location" }), { status: 400 });
    }

    const newParent = await prisma.storageLocation.findUnique({
        where: { id: parentId },
    });

    if (!newParent) {
        return new Response(JSON.stringify({ error: "Target location not found" }), { status: 404 });
    }

    // check if parents of location (id) include the new parent (parentId) to avoid circular references
    let currentParentId = newParent.parentId;
    while (currentParentId) {
        if (currentParentId === id) {
            return new Response(JSON.stringify({ error: "Cannot move location into one of its sublocations" }), { status: 400 });
        }
        const currentParent = await prisma.storageLocation.findUnique({
            where: { id: currentParentId },
        });
        currentParentId = currentParent?.parentId || null;
    }
    
    const updatedLocation = await prisma.storageLocation.update({
        where: { id },
        data: { parentId },
    });

    return new Response(JSON.stringify(updatedLocation));
}
