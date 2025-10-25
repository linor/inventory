import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { Barcode } from "lucide-react";
import BarcodeScannerInput from "./BarcodeScannerInput";
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BarcodeScannerInput>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </BarcodeScannerInput>
    );
}
