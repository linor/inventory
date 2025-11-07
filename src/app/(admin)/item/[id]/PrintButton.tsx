"use client";

import {
    Category,
    Item,
    ItemAttribute,
    StorageLocation,
} from "@/generated/prisma";
import { ItemWithAttributes, printLabelForItem } from "@/lib/labels";
import { ignoreEnterKey } from "@/lib/noenter";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import iziToast from "izitoast";

function printLabel(
    item: ItemWithAttributes,
    location?: StorageLocation | null,
    category?: Category | null,
) {
    return printLabelForItem(item, category, location)
        .then(() => {
            iziToast.success({
                title: "Success",
                message: `Label for item "${item.name}" has been sent to the printer.`,
            });
        })
        .catch((error) => {
            console.error("Error printing label for item:", item.id, error);
            iziToast.error({
                title: "Error",
                message: `Failed to print label for item "${item.name}": ${error.message}`,
            });
        });
}

export default function PrintButton({
    item,
    category,
    location,
}: {
    item: ItemWithAttributes;
    category?: Category | null;
    location?: StorageLocation | null;
}) {
    return (
        <button
            className="btn btn-outline"
            onClick={() => printLabel(item, location, category)}
            onKeyDown={ignoreEnterKey}
            onKeyUp={ignoreEnterKey}
        >
            <FontAwesomeIcon icon={faPrint} />
        </button>
    );
}
