import { Identifier } from "@/app/api/id/[id]/route";

export default function NewLocationDetails({ id }: { id: string }) {
    return (
        <>Unknown location: {id}</>
    );
}
