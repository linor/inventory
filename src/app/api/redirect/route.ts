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
        return new Response(JSON.stringify({ url: `/location/${barcode}` }));
    }

    const item = await prisma.item.findUnique({
        where: { id: barcode }
    });

    if (item) {
        return new Response(JSON.stringify({ url: `/item/${item.id}` }));
    }
    
    if (barcode.startsWith(process.env.LOCATION_ID_PREFIX || "STO-")) {
        return new Response(JSON.stringify({ url: `/location/new?prefill=${barcode}` }));
    }

    if (barcode.startsWith(process.env.ITEM_ID_PREFIX || "INV")) {
        return new Response(JSON.stringify({ url: `/item/new?prefill=${barcode}` }));
    }

    return new Response(JSON.stringify({ }));
}