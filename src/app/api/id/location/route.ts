import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const idPrefix = process.env.LOCATION_ID_PREFIX || "LOC";
    const idLength = parseInt(process.env.LOCATION_ID_LENGTH || "5", 10);

    let generatedId = "";
    while (generatedId === "") {
        const randomPart = Math.random().toString(36).substring(2, 2 + idLength).toUpperCase();
        const candidateId = `${idPrefix}${randomPart}`;

        const existingLocation = await prisma.storageLocation.findUnique({
            where: { id: candidateId }
        });

        if (!existingLocation) {
            generatedId = candidateId;
        }
    }

    return NextResponse.json({ id: generatedId });
}