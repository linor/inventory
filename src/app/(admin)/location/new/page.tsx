import prisma from "@/lib/prisma";
import PageHeader from "../../PageHeader";
import NewLocationForm from "./form";
export default async function NewLocation() {
    const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "Locations", href: "/location" }, { name: "New" }]} /> 
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>New Storage Location</h1>
                <NewLocationForm allLocations={allLocations} />
            </main>
        </>
    );
}
