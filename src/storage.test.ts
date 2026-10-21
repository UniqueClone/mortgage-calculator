import { describe, expect, it } from "vitest";
import { defaultSettings, loadState, saveState } from "./storage";

const memoryStorage = (initial: Record<string, string> = {}) => {
    const data = new Map(Object.entries(initial));
    return {
        data,
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
        removeItem: (key: string) => void data.delete(key),
    };
};

describe("loadState", () => {
    it("uses defaults when nothing is saved", () => {
        const state = loadState(memoryStorage());
        expect(state.settings).toEqual(defaultSettings);
        expect(state.options.map((o) => o.id)).toEqual([1, 2, 3]);
        expect(state.options[0]).toEqual({
            id: 1,
            housePrice: 0,
            loanAmount: 0,
            interestRate: 4,
            newBuild: false,
        });
    });

    it("migrates the legacy per-option keys, including the rate", () => {
        const storage = memoryStorage({
            mortgageDetails: JSON.stringify({ interestRate: 3.5, term: 30 }),
            mortgageOption1: JSON.stringify({
                houseValue: 400000,
                loanAmount: 360000,
                localInterestRate: 3.9,
            }),
            mortgageOption2: JSON.stringify({ houseValue: 450000 }),
        });

        const state = loadState(storage);

        expect(state.settings.term).toBe(30);
        expect(state.options[0]).toEqual({
            id: 1,
            housePrice: 400000,
            loanAmount: 360000,
            interestRate: 3.9,
            newBuild: false,
        });
        expect(state.options[1].interestRate).toBe(3.5);
        expect(state.options[2].housePrice).toBe(0);
    });

    it("ignores corrupt or mistyped values", () => {
        const storage = memoryStorage({
            mortgageDetails: "{not json",
            mortgageOptions: JSON.stringify([
                { id: 4, housePrice: "lots", loanAmount: null },
            ]),
        });

        const state = loadState(storage);

        expect(state.settings).toEqual(defaultSettings);
        expect(state.options).toEqual([
            {
                id: 4,
                housePrice: 0,
                loanAmount: 0,
                interestRate: 4,
                newBuild: false,
            },
        ]);
    });

    it("drops the old stampDuty fee override", () => {
        const storage = memoryStorage({
            mortgageDetails: JSON.stringify({
                fees: { legalFee: 3000, stampDuty: 1 },
            }),
        });

        const { fees } = loadState(storage).settings;

        expect(fees.legalFee).toBe(3000);
        expect(fees).not.toHaveProperty("stampDuty");
    });
});

describe("saveState", () => {
    it("round-trips and removes the legacy keys", () => {
        const storage = memoryStorage({ mortgageOption1: "{}" });
        const state = loadState(storage);
        state.settings.firstTimeBuyer = false;
        state.options[0].housePrice = 300000;

        saveState(storage, state);

        expect(storage.data.has("mortgageOption1")).toBe(false);
        expect(loadState(storage)).toEqual(state);
    });
});
