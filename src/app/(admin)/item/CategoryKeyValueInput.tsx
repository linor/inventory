import React, { Dispatch, SetStateAction } from "react";
import { Category } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { determineKeyValuePairsForCategory } from "./CategoryKeyValueActions";
import { Input } from "@heroui/react";

export type CategoryKeyValue = {
  key: string;
  name: string;
  value: string;
};

export function CategoryKeyValueInputState(): [
  any,
  Dispatch<SetStateAction<any>>,
  (categoryId: number | null) => Promise<void>,
] {
  const [keyValue, setKeyValue] = React.useState<CategoryKeyValue[] | null>(
    null,
  );

  async function updateCategoryKeyValue(categoryId: number | null) {
    const newValues = await determineKeyValuePairsForCategory(
      categoryId,
      keyValue || [],
    );
    setKeyValue(newValues);
  }

  return [keyValue, setKeyValue, updateCategoryKeyValue];
}

type CategoryKeyValueInputProps = {
  keyvalues?: CategoryKeyValue[];
  updateValues?: Dispatch<SetStateAction<CategoryKeyValue[] | null>>;
};

export default function CategoryKeyValueInput({
  keyvalues,
  updateValues,
}: CategoryKeyValueInputProps) {
  return (
    <>
      {(keyvalues || []).map((pair, index) => (
        <div key={index} className="mb-2 flex w-full items-center space-x-2">
          <Input
            label={pair.name || pair.key}
            labelPlacement="inside"
            name={`param_${pair.key}`}
            type="text"
            value={pair.value}
            onChange={(e) => {
              pair.value = e.target.value;
              if (updateValues && keyvalues) updateValues([...keyvalues]);
            }}
          />
        </div>
      ))}
    </>
  );
}
