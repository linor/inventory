export function ignoreEnterKey(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
}
