import prisma from "@/lib/prisma";
import PageHeader from "../../PageHeader";
import NewItemForm, { NewItemStartValue } from "./form";
import { mergeKeyValuePairsForCategory } from "../CategoryKeyValueActions";
import { FlashMessageProvider } from "@thewebartisan7/next-flash-message/components";
import { convertItemAttributesToKeyValuePairs } from "../utils";

export default async function NewItemPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const categories = await prisma.category.findMany({ include: { keys: true } }) || [];
    const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });

    const searchParamsResolved = await searchParams;
    let prefill = searchParamsResolved.prefill;
    const formOptions = {
        continueadding: searchParamsResolved.continueadding ? true : false,
        printlabel: searchParamsResolved.printlabel ? true : false,
        labelvariant: searchParamsResolved.labelvariant ? String(searchParamsResolved.labelvariant) : "default",
    };

    let copy = searchParamsResolved.copy;
    let itemToCopy: NewItemStartValue | null = null;

    if (copy) {
        const sourceItem = await prisma.item.findUnique({
            where: { id: typeof copy === "string" ? copy : "" },
            include: { attributes: true },
        });
        const sourceCategory = sourceItem?.categoryId
            ? categories.find((cat) => cat.id === sourceItem.categoryId)
            : null;

        if (sourceItem) {
            itemToCopy = {
                item: sourceItem,
                categoryKeyValues: mergeKeyValuePairsForCategory(sourceCategory, convertItemAttributesToKeyValuePairs(sourceItem.attributes))
            }
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
                <NewItemForm categories={categories} locations={allLocations} id={id} source={itemToCopy} options={formOptions} />
                <FlashMessageProvider />
            </main>
        </>
    );
}
