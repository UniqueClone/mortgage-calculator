/**
 * Turns what the user typed into a number, or returns undefined if the text
 * isn't an acceptable partial number. Thousands separators and spaces are
 * ignored; an empty field is 0.
 */
export const parseNumberText = (
    text: string,
    decimals: number
): number | undefined => {
    const cleaned = text.replace(/[,\s]/g, "");
    const pattern =
        decimals > 0 ? new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`) : /^\d*$/;

    if (!pattern.test(cleaned)) {
        return undefined;
    }

    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
};

export const formatNumber = (
    value: number,
    decimals: number,
    groupDigits: boolean
) =>
    value.toLocaleString("en-IE", {
        maximumFractionDigits: decimals,
        useGrouping: groupDigits,
    });

export const clamp = (value: number, min = -Infinity, max = Infinity) =>
    Math.min(Math.max(value, min), max);
