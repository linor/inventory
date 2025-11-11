import { StorageLocation } from "@/generated/prisma";

export default function LocationDetails({ location }: { location: StorageLocation }) {
    return (
        <>Location: {location.name}</>
    );
}