

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const enumToPrettyString = (enumV: any) => enumV?.split("_")
    .map((part: string) => capitalize(part.toLowerCase()))
    .join(" ")