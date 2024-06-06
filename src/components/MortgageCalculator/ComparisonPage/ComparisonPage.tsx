import React from "react";
import { ComparisonSection } from "./ComparisonSection";

interface ComparisonPageProps {}

const ComparisonPage: React.FC<ComparisonPageProps> = (
    props: ComparisonPageProps
) => {
    return (
        <div>
            <h1>Compare Mortgages</h1>
            <ComparisonSection
                option1={{
                    housePrice: 440000,
                    depositPercentage: 0.1,
                    mortgageTerm: 35,
                    interestRate: 3.8,
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
                    interestRate: 3.8,
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
                    interestRate: 3.8,
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
