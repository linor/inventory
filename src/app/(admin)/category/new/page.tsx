import { requireAdminRole } from "@/auth";
import PageHeader from "../../PageHeader";
import NewCategoryForm from "./form";

export default async function NewCategoryPage() {
    await requireAdminRole();
    
    return (
        <>
            <PageHeader breadcrumbs={[{ name: "Categories", href: "/category" }, { name: "New" }]} /> 
            <main className="shrink-0 items-center gap-2 px-4">
                <h1>New Category</h1>
                <NewCategoryForm />
            </main>
        </>
    );
}