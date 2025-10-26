"use client";

import { Category, StorageLocation } from "@/generated/prisma";
import { ignoreEnterKey } from "@/lib/noenter";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { useState, useActionState } from "react";
import { id } from "zod/v4/locales";
import { NewItemFormSchema } from "./schema";
import { newItemAction } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import CategorySelect from "../CategorySelect";
import LocationSelectInput from "../../location/LocationSelect";
import { generatedNewItemId } from "./action";
import CategoryKeyValueInput, { CategoryKeyValueInputState } from "../CategoryKeyValueInput";

interface NewItemFormProps {
  categories: Category[];
  locations?: StorageLocation[];
  id?: string;
}

export default function NewItemForm({ categories, locations, id }: NewItemFormProps) {
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [state, action, isPending] = useActionState(
    newItemAction,
    {}
  );
  const [generatedId, setGeneratedId] = useState(id || "");
  const [categoryKeyValues, setCategoryKeyValues, updateCategoryKeyValue] = CategoryKeyValueInputState();

  if (!categories) {
    categories = [];
  }

  const generateNewId = () => {
    setIsGeneratingId(true);

    generatedNewItemId()
      .then((id) => {
        setGeneratedId(id);
      })
      .finally(() => setIsGeneratingId(false));
  };

  function categoryChange(categoryId: number | null) {
    console.log("Selected category ID:", categoryId);
  }

  return (
    <Form action={action}>
      <Input
        isRequired
        errorMessage="Please enter a valid ID"
        label="ID"
        labelPlacement="inside"
        name="id"
        placeholder="Enter a unique ID for this location"
        type="text"
        defaultValue={state?.form?.id}
        value={generatedId}
        onKeyDown={ignoreEnterKey}
        onValueChange={(newvalue) => {
          setGeneratedId(newvalue);
        }}
        endContent={
          <Button
            type="button"
            onPress={generateNewId}
            disabled={isGeneratingId}
            variant="flat"
          >
            <FontAwesomeIcon spin={isGeneratingId} icon={faRotate} />
          </Button>
        }
      />
      <Input
        isRequired
        errorMessage="Please enter a valid name"
        label="Name"
        labelPlacement="inside"
        name="name"
        placeholder="Enter a name for this item"
        type="text"
        defaultValue={state?.form?.name}
        onKeyDown={ignoreEnterKey}
      />
      <Textarea
        label="Description"
        placeholder="Enter your description"
        name="description"
        defaultValue={state?.form?.description}
      />
      <CategorySelect categories={categories} onChange={(i) => updateCategoryKeyValue(i)}/>
      <LocationSelectInput
        locations={locations || []}
        keyName="locationId"
        label="Storage Location"
      />

      <CategoryKeyValueInput keyvalues={categoryKeyValues} updateValues={setCategoryKeyValues}/>
      <Button
        color="primary"
        type="submit"
        className="mt-4"
        disabled={isPending}
      >
        Create item
      </Button>
    </Form>
  );
}
