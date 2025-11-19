export function determineKeyPairs(formData: FormData): { key: string; name: string, defaultValue: string | null }[] {
    const pairs = [];
    for(let index = 0; formData.has('key[' + index + ']'); index++) {
        const key = (formData.get('key[' + index + ']')?.toString() || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
        const value = (formData.get('value[' + index + ']')?.toString() || '').trim();
        const defaultValue = (formData.get('defaultValue[' + index + ']')?.toString() || '').trim();
        if (key.length === 0) continue;

        pairs.push({ key, name: value.length === 0 ? key : value, defaultValue: defaultValue.length === 0 ? null : defaultValue });
    }
    return pairs;
}