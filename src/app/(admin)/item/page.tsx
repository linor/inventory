import { prisma } from "@/lib/prisma";
import PageHeader from "../PageHeader";
import ItemList from "./ItemList";
import { FlashMessageProvider } from "@thewebartisan7/next-flash-message/components";

export default async function Page() {
    const items = await prisma.item.findMany({
        orderBy: { name: "asc" },
        include: { category: true, location: true },
    });

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "All Items" }]} />
            <main className="shrink-0 items-center gap-2 px-4">
                <ItemList items={items} />
                <FlashMessageProvider />
            </main>
        </>
    );
}
