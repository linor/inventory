import { Item, StorageLocation } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export type Identifier = { id: string };

export type ItemOrLocationResponse =
    | { type: 'location'; data: StorageLocation }
    | { type: 'item'; data: Item }
    | { type: 'newitem', data: Identifier }
    | { type: 'newlocation', data: Identifier }
    | { error: string };

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const storageLocation = await prisma.storageLocation.findUnique({
        where: { id },
    });

    if (storageLocation) {
        return NextResponse.json({ type: 'location', data: storageLocation });
    }

    const item = await prisma.item.findUnique({
        where: { id },
    });

    if (item) {
        return NextResponse.json({ type: 'item', data: item });
    }

    if (id.startsWith(process.env.ITEM_ID_PREFIX || 'INV-')) {
        return NextResponse.json({ type: 'newitem', data: { id } });
    }

    if (id.startsWith(process.env.LOCATION_ID_PREFIX || 'STO-')) {
        return NextResponse.json({ type: 'newlocation', data: { id } });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}