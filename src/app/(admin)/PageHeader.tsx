import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export type Breadcrumb = {
    name: string;
    href?: string;
};

export default function PageHeader({
    breadcrumbs,
    className
}: {
    breadcrumbs: Breadcrumb[];
    className?: string;
}) {
    return (
        <header className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-4 ${className}`}>
            <SidebarTrigger />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {crumb.href ? (
                                        <BreadcrumbLink href={crumb.href}>
                                            {crumb.name}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>
                                            {crumb.name}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </header>
    );
}
