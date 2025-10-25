export default async function ViewItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // Fetch item details using the id if necessary
    return (
        <div>
            <h1>Viewing item {id}</h1>
        </div>
    );
}
