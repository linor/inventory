import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const { barcode } = await request.json();
    if (!barcode) {
        return new Response(JSON.stringify({ error: "No barcode provided" }), { status: 400 });
    }

    const storageLocation = await prisma.storageLocation.findUnique({
        where: { id: barcode }
    });

    if (storageLocation) {
        console.log("Found location for barcode:", barcode);
        return new Response(JSON.stringify({ url: `/location/${barcode}` }));
    }

    const item = await prisma.item.findUnique({
        where: { id: barcode }
    });

    if (item) {
        console.log("Found item for barcode:", barcode);
        return new Response(JSON.stringify({ url: `/item/${item.id}` }));
    }
    
    console.log("Received barcode:", barcode);
    return new Response(JSON.stringify({ }));
}