import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "@/app/(admin)/PageHeader";
import EditItemForm from "./form";
import { mergeKeyValuePairsForCategory } from "../../CategoryKeyValueActions";
import { ItemFormStartValue } from "../../SharedFormSchema";
import { start } from "repl";

export default async function EditItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const itemDetails = await prisma.item.findUnique({
        where: { id },
        include: { attributes: true },
    });

    if (!itemDetails) {
        notFound();
    }

    const breadcrumbs = [
        { name: "Items", href: "/item" },
        {
            name: itemDetails?.name || "Unnamed Item",
            href: `/item/${itemDetails?.id}`,
        },
        { name: "Edit", href: "" },
    ];

    const categories = await prisma.category.findMany({ include: { keys: true } }) || [];
    const startCategory = categories.find(
        (cat) => cat.id === itemDetails.categoryId,
    );

    const allLocations = await prisma.storageLocation.findMany({
        orderBy: { name: "asc" },
    });

    const sourceItem: ItemFormStartValue = {
        item: itemDetails,
        categoryKeyValues: mergeKeyValuePairsForCategory(startCategory,
            startCategory
                ? itemDetails.attributes.map((attr) => ({
                    key: attr.key,
                    name: "",
                    value: attr.value,
                })) : [])
    };

    return (
        <>
            <PageHeader breadcrumbs={breadcrumbs} />
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>Edit item {id}</h1>
                <EditItemForm
                    categories={categories}
                    locations={allLocations}
                    sourceItem={sourceItem}
                />
            </main>
        </>
    );
}
