import { MortgageFees } from "./MortgageCalculator/MortgageCalculator.mapper";

export interface MortgageProperties {
    housePrice: number;
    depositPercentage: number;
    mortgageTerm: number;
    interestRate: number;
    fees: MortgageFees;
}