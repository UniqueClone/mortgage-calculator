import React from "react";
import { ComparisonSection } from "./ComparisonSection";
import { MortgageFees } from "../MortgageCalculator.mapper";

interface ComparisonPageProps {}

export interface LoanConfig {
    fees: MortgageFees;
    fixedInterestRate: number;
    maxLoanAmount: number | undefined;
    mortgageTerm: number;
    useOneInterestRate: boolean;
}
export const LoanConfigContext = React.createContext<LoanConfig>({
    fees: {
        valuationFee: 185,
        surveyFee: 500,
        legalFee: 3382.5,
        searchFee: 250,
        registerOfDeedsFee: 100,
        landRegistryFee: 975,
    },
    fixedInterestRate: 3.8,
    maxLoanAmount: undefined,
    mortgageTerm: 35,
    useOneInterestRate: true,
});

const ComparisonPage: React.FC<ComparisonPageProps> = () => {
    const [useOneInterestRate, setUseOneInterestRate] =
        React.useState<boolean>(true);
    const [interestRate, setInterestRate] = React.useState<number>(3.8);
    const [maxLoanAmount, setMaxLoanAmount] = React.useState<
        number | undefined
    >(undefined);
    const [mortgageTerm, setMortgageTerm] = React.useState<number>(35);

    return (
        <div>
            <h1>Compare Mortgages</h1>
            <label>
                Use one interest rate?
                <input
                    type="checkbox"
                    checked={useOneInterestRate}
                    onChange={() => setUseOneInterestRate(!useOneInterestRate)}
                />
            </label>

            {useOneInterestRate && (
                <>
                    <br />
                    <label>
                        Interest Rate (%)
                        <br />
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(parseFloat(e.target.value))
                            }
                        />
                    </label>
                </>
            )}

            <label>
                Max Loan Amount (%)
                <br />
                <input
                    type="number"
                    value={maxLoanAmount}
                    onChange={(e) =>
                        setMaxLoanAmount(parseFloat(e.target.value))
                    }
                />
            </label>

            <label>
                Mortgage Term (years)
                <br />
                <input
                    type="number"
                    value={mortgageTerm}
                    onChange={(e) =>
                        setMortgageTerm(parseFloat(e.target.value))
                    }
                />
            </label>

            <LoanConfigContext.Provider
                value={{
                    fees: {
                        valuationFee: 185,
                        surveyFee: 500,
                        legalFee: 3300,
                        searchFee: 250,
                        registerOfDeedsFee: 100,
                        landRegistryFee: 975,
                    },
                    fixedInterestRate: interestRate,
                    maxLoanAmount,
                    mortgageTerm,
                    useOneInterestRate,
                }}
            >
                <ComparisonSection
                    option1={{
                        housePrice: 440000,
                    }}
                    option2={{
                        housePrice: 450000,
                    }}
                    option3={{
                        housePrice: 460000,
                    }}
                />
            </LoanConfigContext.Provider>
        </div>
    );
};

export default ComparisonPage;
