"use client";

import { Category } from "@/generated/prisma";
import {
  Autocomplete,
  AutocompleteItem,
  MenuTriggerAction,
} from "@heroui/react";
import React, { Key } from "react";
import { set } from "zod";

type FieldData = {
  selectedKey: string | null;
  inputValue: string;
  items: Array<Category>;
};

export default function CategorySelect({
  categories,
  initialCategoryId,
  onChange,
}: {
  categories: Array<Category>;
  initialCategoryId?: number | null;
  onChange?: (categoryId: number | null) => void;
}) {
  const startValue: FieldData = {
    selectedKey: null,
    inputValue: "",
    items: categories || [],
  };

  if (initialCategoryId) {
    const initialCategory = categories.find(
      (cat) => cat.id === initialCategoryId,
    );
    if (initialCategory) {
      startValue.selectedKey = String(initialCategory.id);
      startValue.inputValue = initialCategory.name;
    }
  }

  const [categoryId, setCategoryId] = React.useState<string | null>(initialCategoryId ? String(initialCategoryId) : null);
  const [fieldState, setFieldState] = React.useState<FieldData>(startValue);

  const onSelectionChange = (key: Key | null) => {
    setCategoryId(key === null ? null : String(key));
    setFieldState((prevState) => {
      let selectedItem = categories.find(
        (option) => option.id.toString() === String(key),
      );

      if (onChange) {
        onChange(selectedItem ? selectedItem.id : null);
      }

      setCategoryId(key === null ? null : String(key));
      return {
        inputValue: selectedItem?.name || "",
        selectedKey:
          selectedItem?.id.toString() || (key !== null ? String(key) : null),
        items: categories || [],
      };
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

  const onOpenChange = (
    isOpen: boolean,
    menuTrigger: MenuTriggerAction | undefined,
  ) => {
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
        <input type="hidden" name="categoryId" value={categoryId ? categoryId.toString() : ""} />
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
          <AutocompleteItem
            key={item.id.toString()}
            endContent={item.id.toString()}
          >
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
