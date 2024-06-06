export interface MortgageFees {
    valuationFee: number;
    surveyFee: number;
    legalFee: number;
    stampDuty?: number;
    searchFee: number;
}

export const savingsRequired = (deposit: number, fees: MortgageFees) => {
    return deposit + fees.valuationFee + fees.surveyFee + fees.legalFee + (fees.stampDuty ?? deposit / 10) + fees.searchFee;
};

export const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
});