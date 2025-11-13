"use client";

import { Button } from "@/components/ui/button";
import {
    Category,
    StorageLocation,
} from "@/generated/prisma";
import { ItemWithAttributes, printLabelForItem } from "@/lib/labels";
import { ignoreEnterKey } from "@/lib/noenter";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontalIcon,
} from "lucide-react"

function printLabel(
    item: ItemWithAttributes,
    location?: StorageLocation | null,
    category?: Category | null,
    variant: string = "default",
) {
    return printLabelForItem(item, category, location, variant)
        .then(() => {
            toast.success(`Label for item "${item.name}" sent to printer.`);
        })
        .catch((error) => {
            toast.error(`Failed to print label for item "${item.name}": ${error.message}`);
            console.error("Error printing label for item:", item.id, error);
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
        <>
            <Button
                variant="outline"
                onClick={() => printLabel(item, location, category)}
                onKeyDown={ignoreEnterKey}
                onKeyUp={ignoreEnterKey}
            >
                <FontAwesomeIcon icon={faPrint} /> print
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => printLabel(item, location, category, "qrcode")}>
                            QR Only (25x25)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printLabel(item, location, category, "itemname")}>
                            Item Name (19x51)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printLabel(item, location, category, "detailed")}>
                            Detailed (28x89)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printLabel(item, location, category, "fastener")}>
                            Fastener (19x51)
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
