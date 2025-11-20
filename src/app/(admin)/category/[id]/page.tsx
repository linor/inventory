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
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import DeleteCategory from "./DeleteCategory";
import { isAdminUser } from "@/auth";

export default async function LocationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const isAdmin = await isAdminUser();
    const { id } = await params;
    if (isNaN(Number(id))) {
        notFound();
    }

    const categoryDetails = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { keys: true, items: true },
    });

    if (!categoryDetails) {
        notFound();
    }
    const breadcrumbs = [
        { name: "Categories", href: "/category" },
        { name: categoryDetails?.name || "Unknown category", href: "" },
    ];
    categoryDetails?.items.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden flex items-start justify-between">
                    <div>
                        <span className="text-3xl font-bold">
                            {categoryDetails?.name}
                        </span>
                        {categoryDetails?.description && (
                            <p className="text-gray-600 mt-5">
                                {categoryDetails?.description}
                            </p>
                        )}
                        {categoryDetails?.defaultLabelVariant && (
                            <p className="text-gray-600 mt-2 italic">
                                Default label type: {categoryDetails.defaultLabelVariant}
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
                                    <Link href={`/category/${id}/edit`}>
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
                                            <DeleteCategory category={categoryDetails} />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
                        </div>
                    )}
                </div>

                {categoryDetails?.keys && categoryDetails.keys.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Custom Key</TableHead>
                                    <TableHead>Display Name</TableHead>
                                    <TableHead>Default Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categoryDetails.keys.map((keyValue) => (
                                    <TableRow key={keyValue.key}>
                                        <TableCell className="font-medium">
                                            {keyValue.key}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {keyValue.name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {keyValue.defaultValue || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {categoryDetails?.items && categoryDetails.items.length > 0 && (
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
                                {categoryDetails.items.map((item) => (
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
