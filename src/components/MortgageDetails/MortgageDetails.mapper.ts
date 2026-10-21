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

// The largest loan allowed for a house price: the loan-to-value limit,
// further capped by the approved max loan when one is set (0 means none).
export const maxLoanAmount = (housePrice: number, maxLoan: number) => {
    const ltvLimit = housePrice * LOAN_TO_VALUE_LIMIT;
    const limit = maxLoan > 0 ? Math.min(ltvLimit, maxLoan) : ltvLimit;
    return roundToCents(Math.max(limit, 0));
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
