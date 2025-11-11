"use client";

import CameraScanner from "./CameraScanner";
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { ItemOrLocationResponse } from "@/app/api/id/[id]/route";
import { StorageLocation } from "@/generated/prisma";
import { handleScanForItem, moveItemToLocation } from "./ItemActions";
import { ActionMap, ActionResponse, determineActionsForItem, isSame } from "./Actions";
import ItemDetails from "./ItemDetails";
import LocationDetails from "./LocationDetails";
import NewLocationDetails from "./NewLocationDetails";
import NewItemDetails from "./NewItemDetails";
import { de } from "zod/v4/locales";
import { set } from "zod";
import { useRouter } from "next/navigation";
import { handleScanForLocation } from "./LocationActions";

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
    const [actions, setActions] = useState<ActionMap>({});

    const addLogEntry = (entry: string, type: "error" | "info" = "info") => {
        setLogEntries((prevEntries) => {
            const newEntries = [...prevEntries, { entry, type }];
            return newEntries.slice(-10);
        });
    };

    const addErrorLogEntry = (entry: Error) => {
        addLogEntry(entry.message, "error");
    };

    function handleActionResponse(response: Promise<ActionResponse>) {
        response.then((response) => {
            if (response.error) {
                addLogEntry(`Error: ${response.error}`, "error");
            } else if (response.message) {
                addLogEntry(response.message, "info");
            }

            setCurrentItem(response.updatedItem || null);
            setActions(determineActionsForItem(router, response.updatedItem || null));
        }).catch((error) => {
            addLogEntry(`Error handling action response: ${error.message}`, "error");
        });
    }

    function handleScan(data: string) {
        if (actions && data in actions) {
            handleActionResponse(actions[data]());
            return;
        }

        if (isSame(currentItem, data)) {
            addLogEntry(`Cleared current selection`);
            setCurrentItem(null);
            setActions({});
            return;
        }

        fetch(`/api/id/${data}`, { method: "POST" })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    addLogEntry(
                        `Could not find item/location for code: ${data}`,
                        "error"
                    );
                    return;
                }

                if (currentItem && "type" in currentItem) {
                    if (currentItem.type === "location") {
                        handleActionResponse(handleScanForLocation(currentItem.data, result));
                        return;
                    } else if (currentItem.type === "item") {
                        handleActionResponse(handleScanForItem(currentItem.data, result));
                        return;
                    }
                }

                setCurrentItem(result);
                setActions(determineActionsForItem(router, result));
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
                            e.preventDefault();
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
                        {currentItem.type === "item" && <ItemDetails item={currentItem.data} />}
                        {currentItem.type === "location" && <LocationDetails location={currentItem.data} />}
                        {currentItem.type === "newlocation" && <NewLocationDetails id={currentItem.data.id} />}
                        {currentItem.type === "newitem" && <NewItemDetails id={currentItem.data.id} />}
                    </h2>
                </div>
            )}
            {actions && Object.keys(actions).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(actions).map(([name, action]) => (
                        <Button
                            key={name}
                            onClick={() => handleActionResponse(action())}
                        >
                            {name}
                        </Button>
                    ))}
                </div>
            )}

            <div className="mt-4 w-full max-w-md h-64 overflow-y-auto border rounded p-2 bg-white">
                {logEntries.map((entry, index) => (
                    <div
                        key={index}
                        className={`text-sm ${entry.type === "error"
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
