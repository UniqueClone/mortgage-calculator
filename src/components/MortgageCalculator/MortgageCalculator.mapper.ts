export interface MortgageFees {
    deposit: number;
    valuationFee: number;
    surveyFee: number;
    legalFee: number;
    stampDuty: number;
    searchFee: number;
}


export const savingsRequired = (fees: MortgageFees) => {
    return fees.deposit + fees.valuationFee + fees.surveyFee + fees.legalFee + fees.stampDuty + fees.searchFee;
};