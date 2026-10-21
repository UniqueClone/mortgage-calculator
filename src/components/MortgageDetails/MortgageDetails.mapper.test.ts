import { describe, expect, it } from "vitest";
import {
    MortgageFees,
    getMonthlyPayment,
    maxLoanAmount,
    savingsRequired,
    stampDuty,
    totalFees,
} from "./MortgageDetails.mapper";

const fees: MortgageFees = {
    valuationFee: 185,
    surveyFee: 600,
    legalFee: 2800,
    searchFee: 250,
    registerOfDeedsFee: 100,
    landRegistryFee: 975,
};

describe("stampDuty", () => {
    it.each([
        [0, 0],
        [400_000, 4_000],
        [1_000_000, 10_000],
        [1_200_000, 14_000],
        [1_500_000, 20_000],
        [2_000_000, 50_000],
    ])("charges the banded rate on %i", (price, expected) => {
        expect(stampDuty(price)).toBe(expected);
    });
});

describe("savingsRequired", () => {
    it("adds the deposit, fees and stamp duty", () => {
        expect(savingsRequired(400_000, 360_000, fees)).toEqual({
            deposit: 40_000,
            fees: 4_910,
            stampDuty: 4_000,
            total: 48_910,
        });
    });

    it("never has a negative deposit", () => {
        expect(savingsRequired(300_000, 350_000, fees).deposit).toBe(0);
    });

    it("totals the fees", () => {
        expect(totalFees(fees)).toBe(4_910);
    });
});

describe("maxLoanAmount", () => {
    it("is 90% of the price with no approved max loan", () => {
        expect(maxLoanAmount(400_000, 0)).toBe(360_000);
    });

    it("is capped by the approved max loan", () => {
        expect(maxLoanAmount(500_000, 380_000)).toBe(380_000);
    });

    it("ignores an approved max loan above the LTV limit", () => {
        expect(maxLoanAmount(400_000, 500_000)).toBe(360_000);
    });
});

describe("getMonthlyPayment", () => {
    it("amortises the loan", () => {
        expect(getMonthlyPayment(360_000, 4, 35)).toBe(1_593.99);
    });

    it("divides evenly at 0% interest", () => {
        expect(getMonthlyPayment(360_000, 0, 30)).toBe(1_000);
    });

    it.each([
        [0, 4, 30],
        [360_000, 4, 0],
        [NaN, 4, 30],
        [360_000, NaN, 30],
    ])("returns 0 for unusable input (%s, %s, %s)", (loan, rate, term) => {
        expect(getMonthlyPayment(loan, rate, term)).toBe(0);
    });
});
