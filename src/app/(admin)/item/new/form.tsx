"use client";

import Input from "@/components/input/InputField";
import { Category } from "@/generated/prisma";

interface NewItemFormProps {
    categories: Category[];
}

export default function NewItemForm({ categories }: NewItemFormProps) {
    if (!categories) {
        categories = []
    }

    return (
        <form>
            <div>
                <label htmlFor="name">Item Name:</label>
                <Input type="text" id="name" name="name" />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description"></textarea>
            </div>
            <div>
                <label htmlFor="category">Category:</label>
                <select id="category" name="category">
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Create Item</button>
        </form>
    );
}