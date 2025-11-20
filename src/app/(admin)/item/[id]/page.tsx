import prisma from "@/lib/prisma";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
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
import PrintButton from "./PrintButton";
import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontalIcon,
} from "lucide-react"
import DeleteItem from "./DeleteItem";
import { isAdminUser } from "@/auth";

type DisplayAttribute = {
    key: string;
    name: string;
    value?: string | null;
    defaultValue?: string | null;
}

export default async function ViewItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const isAdmin = await isAdminUser();
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

    const attributesToDisplay: DisplayAttribute[] = (item.attributes || []).map(attr => ({ key: attr.key, name: attr.key, value: attr.value }));
    for (const categoryKey of category?.keys || []) {
        const attribute = attributesToDisplay.find(attr => attr.key === categoryKey.key);
        if (attribute) {
            attribute.name = categoryKey.name || categoryKey.key;
            attribute.defaultValue = categoryKey.defaultValue;
        } else {
            attributesToDisplay.push({ key: categoryKey.key, name: categoryKey.name || categoryKey.key, defaultValue: categoryKey.defaultValue });
        }
    }

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden flex items-start justify-between">
                    <div>
                        <span className="text-3xl font-bold">
                            {item?.name}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                            {item?.id}
                        </div>
                        {item?.description && (
                            <p className="text-gray-600 mt-5">
                                {item?.description}
                            </p>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <ButtonGroup>
                                <Button
                                    variant="outline"
                                    asChild
                                >
                                    <Link href={`/item/${item.id}/edit`}>
                                        <FontAwesomeIcon icon={faPenToSquare} /> edit
                                    </Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreHorizontalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem >
                                                <Link href={`/item/new?copy=${encodeURIComponent(item.id)}`}>
                                                    <FontAwesomeIcon icon={faCopy} /> Duplicate item
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DeleteItem item={item} />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                            <ButtonGroup>
                                <PrintButton item={item} category={category} location={location} />
                            </ButtonGroup>
                        </div>
                    )}
                </div>

                {location && (
                    <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden ">
                        {locations.length > 0 && (
                            <>
                                {locations.map((loc, index) => (
                                    <span key={loc.id} className="text-gray-400">
                                        <Link href={`/location/${loc.id}`}>
                                            {loc.name || "Unnamed Location"}
                                        </Link>
                                        <span className="mx-1 text-gray-300">›</span>
                                    </span>
                                ))}
                            </>
                        )}
                        <span className="text-xl">
                            <Link href={`/location/${location.id}`} className="font-bold">
                                {location.name ? location.name : <span className="text-gray-400">Unnamed Location</span>}
                                {location.contents ? <span className="text-gray-300"> ({location.contents}) </span> : ""}
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

                {attributesToDisplay && attributesToDisplay.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Attribute</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attributesToDisplay.map((attr) => (
                                    <TableRow key={attr.key}>
                                        <TableCell className="font-medium">
                                            {attr.name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {attr.value && attr.value.length > 0
                                                ? attr.value
                                                : (
                                                    <span className="text-gray-300">
                                                        {attr.defaultValue || "-"}
                                                    </span>
                                                )
                                            }
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
