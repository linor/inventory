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


export default async function Page() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "All Categories" }]} />
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
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/category/${category.id}`}>
                                            {category.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {category.id}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Link href="/category/new" className="mt-4"><Button>Add New Category</Button></Link>
            </main>
        </>
    );
}
