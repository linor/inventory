"use client";

import { StorageLocation } from "@/generated/prisma";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React from "react";
import { start } from "repl";

type LocationOption = StorageLocation & {
    label: string;
};

function groupLocations(
    locations: StorageLocation[],
    excludeIds: string[] = [],
    parentId: string | null = null,
    prefix: string = ""
): LocationOption[] {
    let grouped: LocationOption[] = [];
    const filteredLocations = locations.filter(
        (loc) => loc.parentId === parentId
    );

    for (const loc of filteredLocations) {
        if (excludeIds.includes(loc.id)) {
            continue;
        }
        
        const label = prefix ? `${prefix} > ${loc.name}` : loc.name;

        grouped.push({
            ...loc,
            label,
        });

        grouped = grouped.concat(groupLocations(locations, excludeIds, loc.id, label));
    }

    return grouped;
}

export default function LocationSelectInput({
    locations,
    parentId,
    excludeIds = [],
}: {
    locations?: StorageLocation[];
    parentId?: string | null;
    excludeIds?: string[];
}) {
    const groupedLocations = groupLocations(locations || [], excludeIds);
    const startValue = {
        selectedKey: "",
        inputValue: "",
        items: groupedLocations || [],
    };

    if (parentId) {
        const selectedLocation = groupedLocations.find(
            (loc) => loc.id === parentId
        );
        if (selectedLocation) {
            startValue.selectedKey = selectedLocation.id;
            startValue.inputValue = selectedLocation.name;
        }
    }

    const [locationId, setLocationId] = React.useState<string | null>(
        parentId || null
    );
    const [fieldState, setFieldState] = React.useState(startValue);

    const onSelectionChange = (key) => {
        setLocationId(key);
        setFieldState((prevState) => {
            let selectedItem = prevState.items.find(
                (option) => option.id === key
            );

            return {
                inputValue: selectedItem?.name || "",
                selectedKey: key,
                items: groupedLocations || [],
            };
        });
    };

    // Specify how each of the Autocomplete values should change when the input
    // field is altered by the user
    const onInputChange = (value) => {
        setFieldState((prevState) => ({
            inputValue: value,
            selectedKey: value === "" ? null : prevState.selectedKey,
            items: groupedLocations.filter(
                (option) =>
                    option.label.toLowerCase().includes(value.toLowerCase()) ||
                    option.id.toLowerCase().includes(value.toLowerCase())
            ),
        }));
    };

    // Show entire list if user opens the menu manually
    const onOpenChange = (isOpen, menuTrigger) => {
        if (menuTrigger === "manual" && isOpen) {
            setFieldState((prevState) => ({
                inputValue: prevState.inputValue,
                selectedKey: prevState.selectedKey,
                items: groupedLocations || [],
            }));
        }
    };

    return (
        <>
            <input type="hidden" name="parentId" value={locationId || ""} />
            <Autocomplete
                inputValue={fieldState.inputValue}
                items={fieldState.items}
                label="Parent Location"
                placeholder="Search a location"
                selectedKey={fieldState.selectedKey}
                variant="bordered"
                onInputChange={onInputChange}
                onOpenChange={onOpenChange}
                onSelectionChange={onSelectionChange}
            >
                {(item) => (
                    <AutocompleteItem key={item.id} endContent={item.id}>
                        {item.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </>
    );
}
