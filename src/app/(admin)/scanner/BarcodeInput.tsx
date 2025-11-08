"use client";

import CameraScanner from "./CameraScanner";
import { Button, Input, user } from "@heroui/react";
import { useState } from "react";
import { ItemOrLocationResponse } from "@/app/api/id/[id]/route";
import { set } from "zod";
import { Item, StorageLocation } from "@/generated/prisma";
import { useRouter } from "next/navigation";

type LogEntry = {
    entry: string;
    type: "error" | "info";
};

export default function BarcodeInput() {
    const router = useRouter();
    const [currentItem, setCurrentItem] =
        useState<ItemOrLocationResponse | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const addLogEntry = (entry: string, type: "error" | "info" = "info") => {
        setLogEntries((prevEntries) => {
            const newEntries = [...prevEntries, { entry, type }];
            return newEntries.slice(-10);
        });
    };

    function moveItemToLocation(
        item: Item,
        location: StorageLocation
    ): Promise<void> {
        return fetch(
            `/api/item/${encodeURIComponent(
                item.id
            )}/move?locationId=${encodeURIComponent(location.id)}`,
            {
                method: "POST",
            }
        )
            .then((response) => response.json())
            .then((updatedItem) => {
                if (updatedItem.error) {
                    addLogEntry(
                        `Error moving item: ${updatedItem.error}`,
                        "error"
                    );
                    return;
                }

                addLogEntry(
                    `Moved item ${updatedItem.name} to location ${location.name}`
                );
            })
            .catch((error) => {
                addLogEntry(`Error moving item: ${error.message}`, "error");
            });
    }

    function handleScanForLocation(newItem: ItemOrLocationResponse, location: StorageLocation): boolean {
        if ("type" in newItem && newItem.type === "item") {
            moveItemToLocation(newItem.data, location);
            return true;
        }
        return false;
    }

    function handleScanForItem(newItem: ItemOrLocationResponse, item: Item): boolean {
        if ("type" in newItem && newItem.type === "location" && currentItem && "data" in currentItem) {
            moveItemToLocation(item, newItem.data).then(() => {
                setCurrentItem(null);
            });
            return true;
        }
        return false;
    }

    function handleScan(data: string) {
        if (
            currentItem &&
            "data" in currentItem &&
            currentItem.data.id === data
        ) {
            addLogEntry(`Cleared current selection`);
            setCurrentItem(null);
            return;
        }

        fetch(`/api/id/${data}`, { method: "POST" })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    if (data.startsWith('INV-')) {
                        router.push('/item/new?prefill=' + encodeURIComponent(data));
                        return;
                    }

                    addLogEntry(
                        `Could not find item/location for code: ${data}`,
                        "error"
                    );
                    return;
                }

                if (currentItem && "type" in currentItem) {
                    if (currentItem.type === "location") {
                        if (handleScanForLocation(result, currentItem.data)) return;
                    } else if (currentItem.type === "item") {
                        if (handleScanForItem(result, currentItem.data)) return;
                    }
                }

                setCurrentItem(result);
                setLogEntries([]);
            })
            .catch((error) => {
                addLogEntry(`Fetch error: ${error.message}`, "error");
            });
    }

    return (
        <>
            <div className="hidden md:block">
                <h1>Scanner</h1>

                <Input
                    placeholder="Scan a barcode..."
                    className="w-full max-w-md"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleScan(e.currentTarget.value);
                            setInputValue("");
                        }
                    }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
            <div className="md:hidden">
                <CameraScanner onScan={handleScan} />
            </div>
            {currentItem && "type" in currentItem && (
                <div className="mt-4 p-4 border rounded bg-white max-w-md w-full">
                    <h2 className="text-lg font-medium mb-2">
                        {currentItem.type === "item"
                            ? `Item: ${currentItem.data.name}`
                            : `Location: ${currentItem.data.name}`}
                    </h2>
                </div>
            )}
            <div className="mt-4 w-full max-w-md h-64 overflow-y-auto border rounded p-2 bg-white">
                {logEntries.map((entry, index) => (
                    <div
                        key={index}
                        className={`text-sm ${
                            entry.type === "error"
                                ? "text-red-600"
                                : "text-gray-800"
                        }`}
                    >
                        {entry.entry}
                    </div>
                ))}
            </div>
        </>
    );
}
