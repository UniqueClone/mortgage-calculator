import { describe, expect, it } from "vitest";
import { MortgageSettings, defaultSettings } from "../../storage";
import {
    MortgageFees,
    calculateOption,
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
    const noLimits = { maxLoan: 0, income: 0, firstTimeBuyer: true };

    it("is 90% of the price with no other limits", () => {
        expect(maxLoanAmount(400_000, noLimits)).toEqual({
            amount: 360_000,
            reason: "loanToValue",
        });
    });

    it("is capped by the approved max loan", () => {
        expect(
            maxLoanAmount(500_000, { ...noLimits, maxLoan: 380_000 })
        ).toEqual({ amount: 380_000, reason: "maxLoan" });
    });

    it("ignores an approved max loan above the LTV limit", () => {
        expect(
            maxLoanAmount(400_000, { ...noLimits, maxLoan: 500_000 }).amount
        ).toBe(360_000);
    });

    it("is capped at 4x income for first-time buyers", () => {
        expect(maxLoanAmount(500_000, { ...noLimits, income: 100_000 })).toEqual(
            { amount: 400_000, reason: "loanToIncome" }
        );
    });

    it("is capped at 3.5x income for other buyers", () => {
        expect(
            maxLoanAmount(500_000, {
                ...noLimits,
                income: 100_000,
                firstTimeBuyer: false,
            }).amount
        ).toBe(350_000);
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

describe("calculateOption", () => {
    const settings: MortgageSettings = {
        ...defaultSettings,
        interestRate: 4,
        term: 35,
        fees,
    };
    const option = {
        id: 1,
        housePrice: 400_000,
        loanAmount: 360_000,
        interestRate: 3,
    };

    it("uses the shared rate when set", () => {
        const result = calculateOption(option, settings);
        expect(result.interestRate).toBe(4);
        expect(result.monthlyPayment).toBe(1_593.99);
        expect(result.savings.total).toBe(48_910);
        expect(result.loanWarning).toBeUndefined();
    });

    it("totals the cost over the term", () => {
        const result = calculateOption(option, settings);
        expect(result.totalRepaid).toBe(669_475.8);
        expect(result.totalInterest).toBe(309_475.8);
    });

    it("shows the payment after rate rises", () => {
        const result = calculateOption(option, settings);
        expect(result.paymentsAfterRateRise).toEqual([
            { rise: 1, monthlyPayment: getMonthlyPayment(360_000, 5, 35) },
            { rise: 2, monthlyPayment: getMonthlyPayment(360_000, 6, 35) },
        ]);
        expect(result.paymentsAfterRateRise[0].monthlyPayment).toBeGreaterThan(
            result.monthlyPayment
        );
    });

    it("has no interest without a loan", () => {
        const result = calculateOption(
            { ...option, loanAmount: 0 },
            settings
        );
        expect(result.totalRepaid).toBe(0);
        expect(result.totalInterest).toBe(0);
    });

    it("uses the option's own rate otherwise", () => {
        const result = calculateOption(option, {
            ...settings,
            useGlobalInterestRate: false,
        });
        expect(result.interestRate).toBe(3);
    });

    it.each([
        [{ loanAmount: 500_000 }, {}, "More than the house price."],
        [{ loanAmount: 370_000 }, {}, "Above 90% of the price (€360,000.00)."],
        [
            { loanAmount: 360_000 },
            { income: 80_000 },
            "Above 4× your income (€320,000.00).",
        ],
        [
            { loanAmount: 360_000 },
            { maxLoan: 300_000 },
            "Above your approved max loan (€300,000.00).",
        ],
    ])("warns when the loan is too high (%j, %j)", (change, limits, warning) => {
        const result = calculateOption(
            { ...option, ...change },
            { ...settings, ...limits }
        );
        expect(result.loanWarning).toBe(warning);
    });
});
