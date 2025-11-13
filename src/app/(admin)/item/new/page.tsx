import prisma from "@/lib/prisma";
import PageHeader from "../../PageHeader";
import NewItemForm, { NewItemStartValue } from "./form";
import { determineKeyValuePairsForCategory } from "../CategoryKeyValueActions";
import { FlashMessageProvider } from "@thewebartisan7/next-flash-message/components";

export default async function NewItemPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const categories = await prisma.category.findMany();
    const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });

    let prefill = (await searchParams).prefill;
    let continueadding = (await searchParams).continueadding ? true : false;

    let copy = (await searchParams).copy;
    let itemToCopy: NewItemStartValue | null = null;

    if (copy) {
        const sourceItem = await prisma.item.findUnique({
            where: { id: typeof copy === "string" ? copy : "" },
            include: { attributes: true },
        });

        if (sourceItem) {
            itemToCopy = {
                item: sourceItem,
                categoryKeyValues: sourceItem.categoryId ? await determineKeyValuePairsForCategory(sourceItem.categoryId, sourceItem.attributes.map(attr => ({
                    key: attr.key,
                    name: "",
                    value: attr.value,
                }))) : [],
            };
        }
    }

    const id = typeof prefill === "string" ? prefill : undefined;

    return (
        <>
            <PageHeader
                breadcrumbs={[{ name: "Items", href: "/item" }, { name: "New" }]}
            />
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>New item</h1>
                <NewItemForm categories={categories} locations={allLocations} id={id} source={itemToCopy} continueadding={continueadding} />
                <FlashMessageProvider />
            </main>
        </>
    );
}
