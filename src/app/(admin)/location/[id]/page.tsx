import prisma from "@/lib/prisma";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
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
import { printLabelForLocation } from "@/lib/labels";
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
import DeleteLocation from "./DeleteLocation";
import { isAdminUser } from "@/auth";

export default async function LocationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const isAdmin = await isAdminUser();

    const { id } = await params;
    const locationDetails = await prisma.storageLocation.findUnique({
        where: { id },
        include: { children: true, parent: true, items: true },
    });

    locationDetails?.children.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );
    locationDetails?.items.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );

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
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden flex items-start justify-between">
                    <div>
                        <span className="text-3xl font-bold">
                            {locationDetails?.name || "Unnamed Location"} {locationDetails?.contents &&
                                `(${locationDetails.contents})`}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                            {locationDetails?.id}
                        </div>
                        {locationDetails?.description && (
                            <p className="text-gray-600 mt-5">
                                {locationDetails?.description}
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
                                    <Link href={`/location/${id}/edit`}>
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
                                            <DeleteLocation location={locationDetails!} />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                            <ButtonGroup>
                                <PrintButton location={locationDetails!} />
                            </ButtonGroup>
                        </div>
                    )}
                </div>

                {locationDetails?.children &&
                    locationDetails.children.length > 0 && (
                        <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-muted font-heavy">
                                        <TableHead>Sublocation</TableHead>
                                        <TableHead>Contents</TableHead>
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
                                            <TableCell className="font-medium">
                                                {child.contents ? (
                                                    child.contents
                                                ) : (
                                                    <span className="text-gray-400">Storage container</span>
                                                )}
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
