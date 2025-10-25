"use client";

import { CategoryKey } from "@/generated/prisma";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function CustomKeys({
    initialValue,
}: {
    initialValue?: CategoryKey[];
}) {
    const initialPairs = initialValue && initialValue.length > 0 ? initialValue.map(k => ({ key: k.key, value: k.name })) : [{ key: "", value: "" }];
    const [pairs, setPairs] = useState(initialPairs);

    const handleChange = (index, field, value) => {
        const updatedPairs = [...pairs];
        updatedPairs[index][field] = value;
        setPairs(updatedPairs);
    };

    const addPair = () => {
        setPairs([...pairs, { key: "", value: "" }]);
    };

    const removePair = (index) => {
        const updatedPairs = pairs.filter((_, i) => i !== index);
        setPairs(updatedPairs);
    };

    return (
        <div className="w-full rounded-xl border mt-4 overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>

            {pairs.map((pair, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                        type="text"
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) => {
                            const val = e.target.value.replace(
                                /[^a-zA-Z0-9_-]/g,
                                ""
                            );
                            handleChange(index, "key", val);
                        }}
                        className="border p-2 w-1/2"
                        name={`key[${index}]`}
                        pattern="[a-zA-Z0-9_-]*"
                        title="Only letters, numbers, _ and - are allowed"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={pair.value}
                        onChange={(e) =>
                            handleChange(index, "value", e.target.value)
                        }
                        className="border p-2 w-1/2"
                        name={`value[${index}]`}
                    />
                    <button
                        type="button"
                        onClick={() => removePair(index)}
                        className="text-red-500"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <Button type="button" onPress={addPair} className="mt-4">
                Add Field
            </Button>
        </div>
    );
}
