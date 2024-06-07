import React from "react";
import { ComparisonSection } from "./ComparisonSection";

interface ComparisonPageProps {}

const ComparisonPage: React.FC<ComparisonPageProps> = () => {
    const [useOneInterestRate, setUseOneInterestRate] =
        React.useState<boolean>(true);
    const [interestRate, setInterestRate] = React.useState<number>(3.8);

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
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(parseInt(e.target.value))
                            }
                        />
                    </label>
                </>
            )}

            <ComparisonSection
                option1={{
                    housePrice: 440000,
                    depositPercentage: 0.1,
                    mortgageTerm: 35,
                    interestRate: useOneInterestRate ? interestRate : undefined,
                    fees: {
                        valuationFee: 185,
                        surveyFee: 500,
                        legalFee: 3300,
                        searchFee: 250,
                    },
                }}
                option2={{
                    housePrice: 450000,
                    depositPercentage: 0.1,
                    mortgageTerm: 35,
                    interestRate: useOneInterestRate ? interestRate : undefined,
                    fees: {
                        valuationFee: 185,
                        surveyFee: 500,
                        legalFee: 3300,
                        searchFee: 250,
                    },
                }}
                option3={{
                    housePrice: 460000,
                    depositPercentage: 0.1,
                    mortgageTerm: 35,
                    interestRate: useOneInterestRate ? interestRate : undefined,
                    fees: {
                        valuationFee: 185,
                        surveyFee: 500,
                        legalFee: 3300,
                        searchFee: 250,
                    },
                }}
            />
        </div>
    );
};

export default ComparisonPage;
