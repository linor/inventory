import { StorageLocation } from "@/generated/prisma";
import { Link } from "@heroui/react";

export default function LocationDetails({ location }: { location: StorageLocation }) {
    return (
        <Link href={`/location/${location.id}`}>
            Location: {location.name} {location?.contents && `(${location.contents})`}
        </Link>
    );
}