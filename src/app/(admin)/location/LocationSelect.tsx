"use client";

import { StorageLocation } from "@/generated/prisma";
import { Autocomplete, AutocompleteItem, MenuTriggerAction } from "@heroui/react";
import React, { Key } from "react";

type LocationOption = StorageLocation & {
    label: string;
};


type FieldData = {
    selectedKey: Key | null;
    inputValue: string;
    items: Array<LocationOption>;
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
    keyName = "parentId",
    label = "Parent Location"
}: {
    locations?: StorageLocation[];
    parentId?: string | null;
    excludeIds?: string[];
    keyName?: string;
    label?: string;
}) {
    const groupedLocations = groupLocations(locations || [], excludeIds);
    const startValue: FieldData = {
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

    const [locationId, setLocationId] = React.useState<Key | null>(
        parentId || null
    );
    const [fieldState, setFieldState] = React.useState<FieldData>(startValue);

    const onSelectionChange = (key: Key | null) => {
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

    const onInputChange = (value: string) => {
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

    const onOpenChange = (isOpen: boolean, menuTrigger: MenuTriggerAction | undefined) => {
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
            <input type="hidden" name={keyName} value={locationId ? locationId.toString() : ""} />
            <Autocomplete
                inputValue={fieldState.inputValue}
                items={fieldState.items}
                label={label}
                placeholder="Search a location"
                selectedKey={fieldState.selectedKey == null ? undefined : String(fieldState.selectedKey)}
                variant="bordered"
                onInputChange={onInputChange}
                onOpenChange={onOpenChange}
                onSelectionChange={onSelectionChange}
            >
                {(item) => (
                    <AutocompleteItem key={item.id.toString()} endContent={item.id.toString()}>
                        {item.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </>
    );
}
