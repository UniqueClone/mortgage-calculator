import { describe, expect, it } from "vitest";
import { clamp, formatNumber, parseNumberText } from "./numberText";

describe("parseNumberText", () => {
    it.each([
        ["", 0],
        ["400000", 400000],
        ["400,000", 400000],
        ["3.", 3],
        ["3.75", 3.75],
        [".5", 0.5],
    ])("accepts %j", (text, expected) => {
        expect(parseNumberText(text, 2)).toBe(expected);
    });

    it.each(["abc", "3.756", "-5", "1.2.3", "1e5"])("rejects %j", (text) => {
        expect(parseNumberText(text, 2)).toBeUndefined();
    });

    it("rejects decimals when none are allowed", () => {
        expect(parseNumberText("35.5", 0)).toBeUndefined();
        expect(parseNumberText("35", 0)).toBe(35);
    });
});

describe("formatNumber", () => {
    it("groups thousands when asked", () => {
        expect(formatNumber(400000, 2, true)).toBe("400,000");
        expect(formatNumber(400000.5, 2, true)).toBe("400,000.5");
        expect(formatNumber(400000, 2, false)).toBe("400000");
    });
});

describe("clamp", () => {
    it("limits to the range", () => {
        expect(clamp(0, 1, 40)).toBe(1);
        expect(clamp(50, 1, 40)).toBe(40);
        expect(clamp(5)).toBe(5);
    });
});
