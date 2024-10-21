export function capitalize(sentence: string): string {
    if (!sentence) return sentence;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function capitalizeAll(sentence: string): string {
    if (!sentence) return sentence;
    return sentence
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

