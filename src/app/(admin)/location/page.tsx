import prisma from "@/lib/prisma";
import Link from "next/dist/client/link";
import PageHeader from "../PageHeader";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StorageLocation } from "@/generated/prisma";

type GroupedStorageLocation = { location: StorageLocation; indentation: number };

function groupByParent(locations: StorageLocation[], parentId: string | null = null, indentation: number = 0): GroupedStorageLocation[] {
    const grouped: GroupedStorageLocation[] = [];
    locations.filter(location => location.parentId === parentId).forEach(location => {
        grouped.push({ location, indentation });
        grouped.push(...groupByParent(locations, location.id, indentation + 1));
    });

    return grouped;
}

export default async function Page() {
    const locations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });
    const groupedLocations = groupByParent(locations);

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "All Locations" }]} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-muted font-heavy">
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[100px] text-right">
                                    ID
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupedLocations.map(({ location, indentation }) => (
                                <TableRow key={location.id}>
                                    <TableCell className="font-medium" style={{ paddingLeft: `${8 + (indentation * 16)}px` }}>
                                        <Link href={`/location/${location.id}`}>
                                            {location.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {location.id}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Link href="/location/new" className="mt-4"><Button>Add New Location</Button></Link>
            </main>
        </>
    );
}
