export interface MortgageFees {
    valuationFee: number;
    surveyFee: number;
    legalFee: number;
    stampDuty?: number;
    searchFee: number;
    registerOfDeedsFee: number;
    landRegistryFee: number;
}

export const savingsRequired = (deposit: number, fees: MortgageFees) => {
    return deposit + fees.valuationFee + fees.surveyFee + fees.legalFee + (fees.stampDuty ?? deposit / 10) + fees.searchFee + fees.registerOfDeedsFee + fees.landRegistryFee;
};

export const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
});
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