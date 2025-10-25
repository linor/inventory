import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCategoryForm from "./form";
import PageHeader from "@/app/(admin)/PageHeader";

export default async function EditCategoryPage({
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
        { name: categoryDetails?.name || 'Unknown category', href: `/category/${categoryDetails?.id}` },
        { name: "Edit", href: "" },
    ]

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>Edit Category {id}</h1>
                <EditCategoryForm original={categoryDetails!} />
            </main>
        </>
    );
}
