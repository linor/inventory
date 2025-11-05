import prisma from "@/lib/prisma";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../PageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllParents } from "../util";

export default async function LocationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const locationDetails = await prisma.storageLocation.findUnique({
        where: { id },
        include: { children: true, parent: true, items: true },
    });

    const allParents = await getAllParents(locationDetails);
    const breadcrumbs = allParents
        .slice()
        .reverse()
        .map((parent) => ({
            name: parent.name,
            href: `/location/${parent.id}`,
        }));
    breadcrumbs.unshift({ name: "Locations", href: "/location" });
    breadcrumbs.push({
        name: locationDetails?.name || "Unnamed Location",
        href: "",
    });

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden">
                    <span className="text-3xl font-bold">
                        {locationDetails?.name || "Unnamed Location"} {locationDetails?.contents &&
                            `(${locationDetails.contents})`}
                        <Link href={`/location/${id}/edit`}>
                            <button className="btn btn-outline">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </Link>
                    </span>
                    <span className="text-lg text-gray-600 ml-2 float-right">
                        {locationDetails?.id}
                    </span>
                    <p className="text-gray-600">
                        {locationDetails?.description}
                    </p>
                </div>

                {locationDetails?.children &&
                    locationDetails.children.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Sublocation</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        ID
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locationDetails.children.map((child) => (
                                    <TableRow key={child.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/location/${child.id}`}
                                            >
                                                {child.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {child.id}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {locationDetails?.items && locationDetails.items.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Item</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        ID
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locationDetails.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/item/${item.id}`}>
                                                {item.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.id}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>
        </>
    );
}
