import prisma from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!id || !locationId) {
        return new Response(JSON.stringify({ error: "Missing id or locationId" }), { status: 400 });
    }

    const item = await prisma.item.findUnique({
        where: { id },
    });

    if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    const location = await prisma.storageLocation.findUnique({
        where: { id: locationId },
    });

    if (!location) {
        return new Response(JSON.stringify({ error: "Location not found" }), { status: 404 });
    }

    const updatedItem = await prisma.item.update({
        where: { id },
        data: { locationId },
    });

    return new Response(JSON.stringify(updatedItem));
}
