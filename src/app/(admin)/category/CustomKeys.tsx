"use client";

import { CategoryKey } from "@/generated/prisma";
import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@heroui/react";
import { useState } from "react";

export default function CustomKeys({
    initialValue,
}: {
    initialValue?: CategoryKey[];
}) {
    const initialPairs = initialValue && initialValue.length > 0
        ? initialValue.map(k => ({ key: k.key, value: k.name, defaultValue: k.defaultValue }))
        : [{ key: "", value: "", defaultValue: "" }];
    const [pairs, setPairs] = useState(initialPairs);

    const handleChange = (index: number, field: string, value: string) => {
        const updatedPairs = [...pairs];
        updatedPairs[index] = { ...updatedPairs[index], [field]: value };
        setPairs(updatedPairs);
    };

    const addPair = () => {
        setPairs([...pairs, { key: "", value: "", defaultValue: "" }]);
    };

    const removePair = (index: number) => {
        const updatedPairs = pairs.filter((_, i) => i !== index);
        setPairs(updatedPairs);
    };

    function addRequiredFastenerKeys() {
        const requiredKeys = [
            { key: "size", value: "Size", defaultValue: "" },
            { key: "toolsize", value: "Tool Size", defaultValue: "" },
            { key: "type", value: "Type", defaultValue: "" },
            { key: "isodin", value: "DIN", defaultValue: "" },
        ];

        const updatedPairs = [...pairs].filter(pair => pair.key !== "" || pair.value !== "" || pair.defaultValue !== "");
        for (const reqKey of requiredKeys) {
            if (!updatedPairs.some(pair => pair.key === reqKey.key)) {
                updatedPairs.push(reqKey);
            }
        }
        setPairs(updatedPairs);
    }

    return (
        <div className="w-full rounded-xl border mt-4 overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>

            {pairs.map((pair, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                        errorMessage="Please enter a valid key"
                        label="Key"
                        labelPlacement="inside"
                        name={`key[${index}]`}
                        placeholder="Enter a key for this category"
                        type="text"
                        value={pair.key}
                        onChange={(e) => {
                            const val = e.target.value.replace(
                                /[^a-zA-Z0-9_-]/g,
                                ""
                            );
                            handleChange(index, "key", val);
                        }}
                        pattern="[a-zA-Z0-9_-]*"
                        title="Only letters, numbers, _ and - are allowed"
                        className="w-1/3"
                    />
                    <Input
                        errorMessage="Please enter a valid name"
                        label="Name"
                        labelPlacement="inside"
                        name={`value[${index}]`}
                        placeholder="Enter a name for this category"
                        type="text"
                        value={pair.value || ""}
                        onChange={(e) => {
                            handleChange(index, "value", e.target.value);
                        }}
                        className="w-1/3"
                    />
                    <Input
                        errorMessage="Please enter a valid default value"
                        label="Default Value"
                        labelPlacement="inside"
                        name={`defaultValue[${index}]`}
                        placeholder="Enter a default value for this key"
                        type="text"
                        value={pair.defaultValue || ""}
                        onChange={(e) => {
                            handleChange(index, "defaultValue", e.target.value);
                        }}
                        className="w-1/3"
                    />
                    <button
                        type="button"
                        onClick={() => removePair(index)}
                        className="hover:text-red-500"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
            <div className="flex items-center mt-4 space-x-2">
                <Button type="button" onPress={addPair}>
                    Add Field
                </Button>
                <span className="text-sm ml-6 cursor-pointer hover:underline" onClick={addRequiredFastenerKeys}>
                    <FontAwesomeIcon icon={faSquarePlus} className="mr-1" />
                    Add required keys for fastener label type
                </span>
            </div>
        </div>
    );
}
