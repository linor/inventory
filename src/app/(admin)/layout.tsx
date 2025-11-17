import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import BarcodeScannerInput from "./BarcodeScannerInput";
import { cookies } from "next/headers"
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <BarcodeScannerInput>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </BarcodeScannerInput>
    );
}
