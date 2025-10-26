import prisma from "@/lib/prisma";
import PageHeader from "../../PageHeader";
import NewItemForm from "./form";

export default async function NewItemPage() {
  const categories = await prisma.category.findMany();
  const allLocations = await prisma.storageLocation.findMany({ orderBy: { name: 'asc' } });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Items", href: "/item" }, { name: "New" }]}
      />
      <main className="shrink-0 items-center gap-2 px-4">
        <h1>New item</h1>
        <NewItemForm categories={categories} locations={allLocations}/>
      </main>
    </>
  );
}
