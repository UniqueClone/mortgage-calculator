export interface MortgageFees {
    valuationFee: number;
    surveyFee: number;
    legalFee: number;
    stampDuty?: number;
    searchFee: number;
    registerOfDeedsFee: number;
    landRegistryFee: number;
}

export const savingsRequired = (houseValue: number, deposit: number, fees: MortgageFees) => {
    return deposit + fees.valuationFee + fees.surveyFee + fees.legalFee + (fees.stampDuty ?? (houseValue / 100)) + fees.searchFee + fees.registerOfDeedsFee + fees.landRegistryFee;
};

export const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
});

export const cleanLoanAmount = (
    housePrice: number,
    loanAmount: number,
    maxLoanAmount: number | undefined
): number => {
    if (loanAmount < 0) {
        return 0;
    } else if (loanAmount > housePrice * 0.9) {
        return cleanLoanAmount(housePrice, housePrice * 0.9, maxLoanAmount);
    } else if (maxLoanAmount && loanAmount > maxLoanAmount) {
        return maxLoanAmount;
    } else {
        return parseFloat(loanAmount.toFixed(2));
    }
};

export const getMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    loanTerm: number
) => {
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        return 0;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const numerator =
        loanAmount *
        monthlyInterestRate *
        (1 + monthlyInterestRate) ** numberOfPayments;
    const denominator = (1 + monthlyInterestRate) ** numberOfPayments - 1;
    return parseFloat((numerator / denominator).toFixed(2));
};

export const setLoanAmountToMax = (houseValue: number, maxLoanAmount: number, setLoanAmount: (newValue: number) => void) => {
    if (houseValue * 0.9 > maxLoanAmount) {
        setLoanAmount(maxLoanAmount);
    } else {
        setLoanAmount(houseValue * 0.9);
    }
}