"use client";

import { StorageLocation } from "@/generated/prisma";
import { printLabelForLocation } from "@/lib/labels";
import { ignoreEnterKey } from "@/lib/noenter";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import iziToast from "izitoast";

function printLabel(location: StorageLocation) {
    return printLabelForLocation(location)
        .then(() => {
            iziToast.success({
                title: "Success",
                message: `Label for location "${location.name}" has been sent to the printer.`,
            });
        })
        .catch((error) => {
            iziToast.error({
                title: "Error",
                message: `Failed to print label for location "${location.name}": ${error.message}`,
            });
        });
}

export default function PrintButton({
    location,
}: {
    location: StorageLocation;
}) {
    return (
        <button
            className="btn btn-outline"
            onClick={() => printLabel(location)}
            onKeyDown={ignoreEnterKey}
            onKeyUp={ignoreEnterKey}
        >
            <FontAwesomeIcon icon={faPrint} />
        </button>
    );
}
