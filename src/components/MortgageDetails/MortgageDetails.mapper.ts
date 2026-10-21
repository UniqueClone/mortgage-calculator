import type { MortgageOptionState, MortgageSettings } from "../../storage";

export interface MortgageFees {
    valuationFee: number;
    surveyFee: number;
    legalFee: number;
    searchFee: number;
    registerOfDeedsFee: number;
    landRegistryFee: number;
}

// Central Bank of Ireland limit for first-time and second/subsequent buyers
// since 1 January 2023.
export const LOAN_TO_VALUE_LIMIT = 0.9;

// Central Bank of Ireland loan-to-income limits since 1 January 2023.
export const loanToIncomeLimit = (firstTimeBuyer: boolean) =>
    firstTimeBuyer ? 4 : 3.5;

export const roundToCents = (value: number) => Math.round(value * 100) / 100;

// Residential rates for instruments executed on or after 2 October 2024.
const STAMP_DUTY_BANDS = [
    { upTo: 1_000_000, rate: 0.01 },
    { upTo: 1_500_000, rate: 0.02 },
    { upTo: Infinity, rate: 0.06 },
];

export const stampDuty = (housePrice: number) => {
    let duty = 0;
    let bandStart = 0;

    for (const { upTo, rate } of STAMP_DUTY_BANDS) {
        if (housePrice <= bandStart) {
            break;
        }
        duty += (Math.min(housePrice, upTo) - bandStart) * rate;
        bandStart = upTo;
    }

    return roundToCents(duty);
};

export const totalFees = (fees: MortgageFees) =>
    fees.valuationFee +
    fees.surveyFee +
    fees.legalFee +
    fees.searchFee +
    fees.registerOfDeedsFee +
    fees.landRegistryFee;

// New homes are sold including 13.5% VAT, but stamp duty is charged on the
// VAT-exclusive price.
const NEW_HOME_VAT_RATE = 0.135;

// Help to Buy rules for applications from 7 October 2026 to 31 December 2029
// (the maximum was €30,000 before that).
export const HELP_TO_BUY = {
    maxRefund: 35_000,
    maxShareOfPrice: 0.1,
    maxPrice: 500_000,
    minLoanToValue: 0.7,
};

export interface HelpToBuyResult {
    amount: number;
    ineligibleReason?: string;
}

// The most Help to Buy can give. The real refund is also limited by the
// income tax and DIRT the buyer paid in the previous four years.
export const helpToBuy = (
    housePrice: number,
    loanAmount: number,
    firstTimeBuyer: boolean,
    newBuild: boolean
): HelpToBuyResult => {
    if (!newBuild || housePrice <= 0) {
        return { amount: 0 };
    }
    if (!firstTimeBuyer) {
        return { amount: 0, ineligibleReason: "Only for first-time buyers." };
    }
    if (housePrice > HELP_TO_BUY.maxPrice) {
        return {
            amount: 0,
            ineligibleReason: `Only for homes up to ${wholeEuros.format(
                HELP_TO_BUY.maxPrice
            )}.`,
        };
    }
    if (loanAmount < housePrice * HELP_TO_BUY.minLoanToValue) {
        return {
            amount: 0,
            ineligibleReason: `The loan must be at least ${
                HELP_TO_BUY.minLoanToValue * 100
            }% of the price.`,
        };
    }

    return {
        amount: roundToCents(
            Math.min(
                HELP_TO_BUY.maxRefund,
                housePrice * HELP_TO_BUY.maxShareOfPrice
            )
        ),
    };
};

export interface SavingsBreakdown {
    deposit: number;
    helpToBuy: number;
    fees: number;
    stampDuty: number;
    total: number;
}

export const savingsRequired = (
    housePrice: number,
    loanAmount: number,
    fees: MortgageFees,
    { newBuild = false, helpToBuy = 0 } = {}
): SavingsBreakdown => {
    const deposit = Math.max(housePrice - loanAmount, 0);
    const helpToBuyUsed = Math.min(helpToBuy, deposit);
    const feesTotal = totalFees(fees);
    const duty = stampDuty(
        newBuild ? housePrice / (1 + NEW_HOME_VAT_RATE) : housePrice
    );

    return {
        deposit,
        helpToBuy: helpToBuyUsed,
        fees: feesTotal,
        stampDuty: duty,
        total: deposit - helpToBuyUsed + feesTotal + duty,
    };
};

export const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
});

// For limits and thresholds, where cents are just noise.
const wholeEuros = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
});

export interface BorrowingLimits {
    /** Approved loan amount; 0 means none. */
    maxLoan: number;
    /** Gross annual household income; 0 means not given. */
    income: number;
    firstTimeBuyer: boolean;
}

export type LoanLimitReason = "loanToValue" | "loanToIncome" | "maxLoan";

// The largest loan allowed for a house price, and which rule sets it: the
// loan-to-value limit, capped by the loan-to-income limit when an income is
// given and by the approved max loan when one is set.
export const maxLoanAmount = (
    housePrice: number,
    { maxLoan, income, firstTimeBuyer }: BorrowingLimits
): { amount: number; reason: LoanLimitReason } => {
    let amount = Math.max(housePrice * LOAN_TO_VALUE_LIMIT, 0);
    let reason: LoanLimitReason = "loanToValue";

    if (income > 0 && income * loanToIncomeLimit(firstTimeBuyer) < amount) {
        amount = income * loanToIncomeLimit(firstTimeBuyer);
        reason = "loanToIncome";
    }
    if (maxLoan > 0 && maxLoan < amount) {
        amount = maxLoan;
        reason = "maxLoan";
    }

    return { amount: roundToCents(amount), reason };
};

export const getMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    loanTerm: number
) => {
    const numberOfPayments = loanTerm * 12;

    if (
        !Number.isFinite(loanAmount) ||
        !Number.isFinite(interestRate) ||
        !Number.isFinite(numberOfPayments) ||
        loanAmount <= 0 ||
        numberOfPayments <= 0
    ) {
        return 0;
    }

    if (interestRate <= 0) {
        return roundToCents(loanAmount / numberOfPayments);
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const growth = (1 + monthlyInterestRate) ** numberOfPayments;
    const monthlyPayment =
        (loanAmount * monthlyInterestRate * growth) / (growth - 1);

    return roundToCents(monthlyPayment);
};

const limitDescriptions: Record<
    LoanLimitReason,
    (firstTimeBuyer: boolean) => string
> = {
    loanToValue: () => `${LOAN_TO_VALUE_LIMIT * 100}% of the price`,
    loanToIncome: (firstTimeBuyer) =>
        `${loanToIncomeLimit(firstTimeBuyer)}× your income`,
    maxLoan: () => "your approved max loan",
};

export const RATE_RISES = [1, 2];

export interface OptionResult {
    interestRate: number;
    maxLoan: number;
    loanWarning?: string;
    monthlyPayment: number;
    totalRepaid: number;
    totalInterest: number;
    /** Monthly payment if the rate rose by each of RATE_RISES points. */
    paymentsAfterRateRise: { rise: number; monthlyPayment: number }[];
    helpToBuy: HelpToBuyResult;
    savings: SavingsBreakdown;
}

export const calculateOption = (
    option: MortgageOptionState,
    settings: MortgageSettings
): OptionResult => {
    const { housePrice, loanAmount } = option;
    const interestRate = settings.useGlobalInterestRate
        ? settings.interestRate
        : option.interestRate;
    const limit = maxLoanAmount(housePrice, settings);

    let loanWarning: string | undefined;
    if (housePrice > 0 && loanAmount > housePrice) {
        loanWarning = "More than the house price.";
    } else if (housePrice > 0 && loanAmount > limit.amount) {
        loanWarning = `Above ${limitDescriptions[limit.reason](
            settings.firstTimeBuyer
        )} (${wholeEuros.format(limit.amount)}).`;
    }

    const monthlyPayment = getMonthlyPayment(
        loanAmount,
        interestRate,
        settings.term
    );
    const totalRepaid = roundToCents(monthlyPayment * settings.term * 12);
    const htb = helpToBuy(
        housePrice,
        loanAmount,
        settings.firstTimeBuyer,
        option.newBuild
    );

    return {
        interestRate,
        maxLoan: limit.amount,
        loanWarning,
        monthlyPayment,
        totalRepaid,
        totalInterest:
            loanAmount > 0 ? roundToCents(totalRepaid - loanAmount) : 0,
        paymentsAfterRateRise: RATE_RISES.map((rise) => ({
            rise,
            monthlyPayment: getMonthlyPayment(
                loanAmount,
                interestRate + rise,
                settings.term
            ),
        })),
        helpToBuy: htb,
        savings: savingsRequired(housePrice, loanAmount, settings.fees, {
            newBuild: option.newBuild,
            helpToBuy: htb.amount,
        }),
    };
};

// Indices of the lowest positive values, or none when fewer than two values
// are filled in (there's nothing to compare yet).
export const lowestPositive = (values: number[]): Set<number> => {
    const positive = values.filter((value) => value > 0);
    if (positive.length < 2) {
        return new Set();
    }

    const lowest = Math.min(...positive);
    return new Set(
        values.flatMap((value, index) => (value === lowest ? [index] : []))
    );
};
