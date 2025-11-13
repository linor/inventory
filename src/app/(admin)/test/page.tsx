"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { addMessage } from "./action";

export default function TestPage() {
    return (
        <div>
            Test page
            <button onClick={async () => {
                await addMessage();
            }}>
                Add Message
            </button>
        </div>
    );
}
