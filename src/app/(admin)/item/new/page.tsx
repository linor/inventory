import prisma from "@/lib/prisma";
import NewItemForm from "./form";

export default async function NewItemPage() {
    const categories = await prisma.category.findMany();
    console.log("Fetched categories:", categories);
    return (
        <div>
            <h1>New Item</h1>
            <NewItemForm categories={categories} />
        </div>
    );
}