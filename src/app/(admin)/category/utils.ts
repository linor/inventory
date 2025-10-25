export function determineKeyPairs(formData: FormData): { key: string; name: string }[] {
    const pairs = [];
    for(let index = 0; formData.has('key[' + index + ']'); index++) {
        const key = (formData.get('key[' + index + ']')?.toString() || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
        const value = (formData.get('value[' + index + ']')?.toString() || '').trim();
        if (key.length === 0) continue;

        pairs.push({ key, name: value.length === 0 ? key : value });
    }
    return pairs;
}