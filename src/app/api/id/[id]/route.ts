import { Item, StorageLocation } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export type ItemOrLocationResponse =
    | { type: 'location'; data: StorageLocation }
    | { type: 'item'; data: Item }
    | { error: string };

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}