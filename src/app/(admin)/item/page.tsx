import { prisma } from "@/lib/prisma";
import PageHeader from "../PageHeader";
import ItemList from "./ItemList";
import { FlashMessageProvider } from "@thewebartisan7/next-flash-message/components";
import { isAdminUser } from "@/auth";

export default async function Page() {
    const isAdmin = await isAdminUser();
    const items = await prisma.item.findMany({
        orderBy: { name: "asc" },
        include: { category: true, location: true },
    });

    items.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );

    return (
        <>
            <PageHeader breadcrumbs={[{ name: "All Items" }]} />
            <main className="shrink-0 items-center gap-2 px-4">
                <ItemList items={items} showNewButton={isAdmin} />
                <FlashMessageProvider />
            </main>
        </>
    );
}
