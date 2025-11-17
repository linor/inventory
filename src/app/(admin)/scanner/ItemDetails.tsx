import { Item } from "@/generated/prisma";
import { Link } from "@heroui/react";

export default function ItemDetails({ item }: { item: Item }) {
    return (
        <Link href={`/item/${item.id}`}>
            Item: {item.name}
        </Link>
    );
}