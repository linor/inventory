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
import { notFound } from "next/navigation";
import { getAllParents } from "../../location/util";

export default async function ViewItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const item = await prisma.item.findUnique({
        where: { id: id },
        include: { attributes: true },
    });

    if (!item) {
        notFound();
    }

    const breadcrumbs = [
        { name: "Items", href: "/item" },
        { name: item?.name || "Unknown item", href: "" },
    ];

    const location = await prisma.storageLocation.findUnique({
        where: { id: item?.locationId || "" },
        include: { parent: true },
    });

    const locations = (await getAllParents(location)).reverse();

    const category = item.categoryId ? await prisma.category.findUnique({
        where: { id: item?.categoryId },
        include: { keys: true },
    }) : undefined;

    const categoryKeyToName = category?.keys.reduce<Record<string, string>>((acc, key) => {
        acc[key.key] = key.name || key.key;
        return acc;
    }, {}) || {};
    
    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden">
                    <span className="text-3xl font-bold">
                        {item?.name}
                        <Link href={`/item/${id}/edit`}>
                            <button className="btn btn-outline">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </Link>
                    </span>
                    <span className="text-lg text-gray-600 ml-2 float-right">
                        {item?.id}
                    </span>
                    <p className="text-gray-600">
                        {item?.description}
                    </p>
                </div>

                {location && (
                    <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden ">
                        {locations.map((loc, index) => (
                            <span key={loc.id} className="text-gray-400">
                                <Link href={`/location/${loc.id}`}>
                                    {loc.name}
                                </Link>
                                {index < locations.length - 1 && " / "}
                            </span>
                        ))}
                        <br />
                        <span className="text-xl font-bold">
                            <Link href={`/location/${location.id}`}>
                                {location.name}
                            </Link>
                        </span>
                    </div>
                )}

                {category && (
                    <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden">
                        <span className="text-l">
                            Category:&nbsp;
                            <Link href={`/category/${category.id}`}>
                                {category.name}
                            </Link>
                        </span>
                    </div>
                )}

                {item?.attributes && item.attributes.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Custom Key</TableHead>
                                    <TableHead>Display Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {item.attributes.map((keyValue) => (
                                    <TableRow key={keyValue.key}>
                                        <TableCell className="font-medium">
                                            {categoryKeyToName[keyValue.key] ? categoryKeyToName[keyValue.key] : keyValue.key}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {keyValue.value}
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
