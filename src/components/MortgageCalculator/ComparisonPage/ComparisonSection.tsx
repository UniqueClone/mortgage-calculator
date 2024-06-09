import React, { useEffect } from "react";
import { MortgageProperties } from "../../MortgageProperties";
import {
    cleanLoanAmount,
    formatter,
    getMonthlyPayment,
    savingsRequired,
} from "../MortgageCalculator.mapper";
import { LoanConfigContext } from "./ComparisonPage";

import "../MortgageCalculator.css";

interface ComparisonSectionProps {
    option1: MortgageProperties;
    option2: MortgageProperties;
    option3: MortgageProperties;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = (
    props: ComparisonSectionProps
) => {
    const { option1, option2, option3 } = props;

    return (
        <div>
            <div className="columns">
                <div className="column column-1">
                    <OptionSection id={1} mortgageProps={option1} />
                </div>

                <div className="column column-2">
                    <OptionSection id={2} mortgageProps={option2} />
                </div>

                <div className="column column-3">
                    <OptionSection id={3} mortgageProps={option3} />
                </div>
            </div>
        </div>
    );
};

const OptionSection: React.FC<{
    id: number;
    mortgageProps: MortgageProperties;
}> = (props: { id: number; mortgageProps: MortgageProperties }) => {
    const config = React.useContext(LoanConfigContext);

    const { id, mortgageProps } = props;
    const [housePrice, setHousePrice] = React.useState(
        mortgageProps.housePrice
    );
    const useOneInterestRate = config.fixedInterestRate !== undefined;
    const [interestRate, setInterestRate] = React.useState(3.8);

    const maxLoanAmount = config.maxLoanAmount;
    const [loanAmount, setLoanAmount] = React.useState(
        cleanLoanAmount(housePrice, housePrice * 0.9, maxLoanAmount)
    );

    useEffect(() => {
        setHousePrice(housePrice);
        setLoanAmount(cleanLoanAmount(housePrice, loanAmount, maxLoanAmount));
    }, [housePrice, maxLoanAmount]);

    return (
        <div>
            <h2
                style={{
                    fontSize: "1.75rem",
                }}
            >
                Option {id}
            </h2>

            <label>
                House Price (€)
                <input
                    type="number"
                    value={housePrice}
                    onChange={(e) => {
                        setHousePrice(parseInt(e.target.value));
                        setLoanAmount(
                            cleanLoanAmount(
                                parseInt(e.target.value),
                                parseInt(e.target.value) * 0.9,
                                maxLoanAmount
                            )
                        );
                    }}
                />
            </label>

            <br />

            <label>
                Loan Amount (%)
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) =>
                        setLoanAmount(
                            cleanLoanAmount(
                                housePrice,
                                parseFloat(e.target.value),
                                maxLoanAmount
                            )
                        )
                    }
                />
            </label>

            <button
                onClick={() =>
                    setLoanAmount(
                        cleanLoanAmount(
                            housePrice,
                            housePrice * 0.9,
                            maxLoanAmount
                        )
                    )
                }
            >
                Set loan amount to max
            </button>

            {!useOneInterestRate && (
                <>
                    <br />
                    <label>
                        Interest Rate (%)
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(parseFloat(e.target.value))
                            }
                        />
                    </label>{" "}
                </>
            )}
            <h3>
                House Price: <p>{formatter.format(housePrice)}</p>
            </h3>
            <h3>
                Monthly Payment:{" "}
                <p>
                    {formatter.format(
                        getMonthlyPayment(
                            loanAmount,
                            config.fixedInterestRate ?? interestRate,
                            config.mortgageTerm
                        )
                    )}
                </p>
            </h3>
            <h3>
                Savings Required:{" "}
                <p>
                    {formatter.format(
                        savingsRequired(housePrice - loanAmount, config.fees)
                        // housePrice -
                        //     loanAmount +
                        //     config.fees.valuationFee +
                        //     config.fees.surveyFee +
                        //     config.fees.legalFee +
                        //     housePrice * 0.01 + // stamp duty
                        //     config.fees.searchFee
                    )}
                </p>
            </h3>
        </div>
    );
};
