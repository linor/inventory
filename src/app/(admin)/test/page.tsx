"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export default function TestPage() {
    return (
        <div>
            Test page
            <Breadcrumbs>
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem>Music</BreadcrumbItem>
                <BreadcrumbItem>Artist</BreadcrumbItem>
                <BreadcrumbItem>Album</BreadcrumbItem>
                <BreadcrumbItem>Songs</BreadcrumbItem>
            </Breadcrumbs>
        </div>
    );
}
