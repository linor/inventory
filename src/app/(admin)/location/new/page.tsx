import prisma from "@/lib/prisma";
import PageHeader from "../../PageHeader";
import NewLocationForm from "./form";
import { requireAdminRole } from "@/auth";

export default async function NewLocation({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    await requireAdminRole();
    
    let prefill = (await searchParams).prefill;

    const id = typeof prefill === "string" ? prefill : undefined;
    const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "Locations", href: "/location" }, { name: "New" }]} /> 
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>New Storage Location</h1>
                <NewLocationForm allLocations={allLocations} id={id} />
            </main>
        </>
    );
}
