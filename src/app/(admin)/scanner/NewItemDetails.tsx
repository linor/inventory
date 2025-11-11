import { Identifier } from "@/app/api/id/[id]/route";

export default function NewItemDetails({ id }: { id: string }) {
    return (
        <>Unknown item: {id}</>
    );
}
