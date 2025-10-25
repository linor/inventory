import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import LocationEditForm from "./form";
import PageHeader from "@/app/(admin)/PageHeader";

export default async function EditLocationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const locationDetails = await prisma.storageLocation.findUnique({
        where: { id },
        include: { children: true, parent: true },
    });

    if (!locationDetails) {
        notFound();
    }

    const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });
    const breadcrumbs = [
        { name: "Locations", href: "/location" },
        { name: locationDetails?.name || 'Unknown location', href: `/location/${locationDetails?.id}` },
        { name: "Edit", href: "" },
    ]

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>Edit Location {id}</h1>
                <LocationEditForm original={locationDetails!} allLocations={allLocations} />
            </main>
        </>
    );
}
