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

export default async function LocationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (isNaN(Number(id))) {
        notFound();
    }

    const categoryDetails = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { keys: true },
    });

    if (!categoryDetails) {
        notFound();
    }
    const breadcrumbs = [
        { name: "Categories", href: "/category" },
        { name: categoryDetails?.name || "Unknown category", href: "" },
    ];

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <div className="w-full rounded-xl border mb-8 mt-4 p-4 overflow-hidden">
                    <span className="text-3xl font-bold">
                        {categoryDetails?.name}
                        <Link href={`/category/${id}/edit`}>
                            <button className="btn btn-outline">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </Link>
                    </span>
                    <p className="text-gray-600">
                        {categoryDetails?.description}
                    </p>
                </div>

                {categoryDetails?.keys && categoryDetails.keys.length > 0 && (
                    <div className="w-full rounded-xl border mb-8 mt-4 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted font-heavy">
                                    <TableHead>Custom Key</TableHead>
                                    <TableHead>Display Name</TableHead>
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
