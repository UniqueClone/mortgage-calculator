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

export interface SavingsBreakdown {
    deposit: number;
    fees: number;
    stampDuty: number;
    total: number;
}

export const savingsRequired = (
    housePrice: number,
    loanAmount: number,
    fees: MortgageFees
): SavingsBreakdown => {
    const deposit = Math.max(housePrice - loanAmount, 0);
    const feesTotal = totalFees(fees);
    const duty = stampDuty(housePrice);

    return {
        deposit,
        fees: feesTotal,
        stampDuty: duty,
        total: deposit + feesTotal + duty,
    };
};

export const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
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

export interface OptionResult {
    interestRate: number;
    maxLoan: number;
    loanWarning?: string;
    monthlyPayment: number;
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
        )} (${formatter.format(limit.amount)}).`;
    }

    return {
        interestRate,
        maxLoan: limit.amount,
        loanWarning,
        monthlyPayment: getMonthlyPayment(
            loanAmount,
            interestRate,
            settings.term
        ),
        savings: savingsRequired(housePrice, loanAmount, settings.fees),
    };
};
