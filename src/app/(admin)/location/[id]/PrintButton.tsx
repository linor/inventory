"use client";

import { Button } from "@/components/ui/button";
import { StorageLocation } from "@/generated/prisma";
import { printLabelForLocation } from "@/lib/labels";
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


function printLabel(location: StorageLocation, variant: string = "default") {
    return printLabelForLocation(location, variant)
        .then(() => {
            toast.success(`Label for location "${location.name || 'Unnamed Location'}" sent to printer.`);
        })
        .catch((error) => {
            toast.error(`Failed to print label for location "${location.name || 'Unnamed Location'}": ${error.message}`);
        });
}

export default function PrintButton({
    location,
}: {
    location: StorageLocation;
}) {
    return (
        <>
            <Button
                variant="outline"
                onClick={() => printLabel(location)}
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
                        <DropdownMenuItem onClick={() => printLabel(location, "qrcode")}>
                            QR Only (25x25)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printLabel(location, "portrait")}>
                            Portrait (54x101)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printLabel(location, "narrowlandscape")}>
                            Narrow landscape (28x89)
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
