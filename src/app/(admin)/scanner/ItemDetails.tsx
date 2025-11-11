import { Item } from "@/generated/prisma";

export default function ItemDetails({ item }: { item: Item }) {
    return (
        <>Item: {item.name}</>
    );
}