"use client";

import { Category } from "@/generated/prisma";
import { Autocomplete, AutocompleteItem, MenuTriggerAction } from "@heroui/react";
import React, { Key } from "react";
import { determineCategoryKeys  } from "./new/action";

type FieldData = {
    selectedKey: string | null;
    inputValue: string;
    items: Array<Category>;
};

export default function CategorySelect({
  categories,
}: {
  categories: Array<Category>;
}) {
  const startValue: FieldData = {
    selectedKey: null,
    inputValue: "",
    items: categories || [],
  };

  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [fieldState, setFieldState] = React.useState<FieldData>(startValue);

  const onSelectionChange = (key: Key | null) => {
    setCategoryId(key === null ? null : String(key));
    setFieldState((prevState) => {
      let selectedItem = categories.find((option) => option.id.toString() === String(key));

      return {
        inputValue: selectedItem?.name || "",
        selectedKey: selectedItem?.id.toString() || (key !== null ? String(key) : null),
        items: categories || [],
      };
    });

    determineCategoryKeys()
        .then((categoryKeys) => {
            console.log("Determined category keys:", categoryKeys);
        });
  };

  const onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      items: categories.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase()),
      ),
    }));
  };

  const onOpenChange = (isOpen: boolean, menuTrigger: MenuTriggerAction | undefined) => {
    if (menuTrigger === "manual" && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: categories || [],
      }));
    }
  };

  return (
    <>
      <Autocomplete
        inputValue={fieldState.inputValue}
        items={fieldState.items}
        label="Category"
        placeholder="Select a category"
        selectedKey={fieldState.selectedKey}
        variant="bordered"
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <AutocompleteItem key={item.id.toString()} endContent={item.id.toString()}>
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
