import React from "react";
import { MortgageProperties } from "../../MortgageProperties";
import { getMonthlyPayment } from "../MortgageCalculator";
import { formatter } from "../MortgageCalculator.mapper";

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
                    <OptionSection id={1} option={option1} />
                </div>

                <div className="column column-2">
                    <OptionSection id={2} option={option2} />
                </div>

                <div className="column column-3">
                    <OptionSection id={3} option={option3} />
                </div>
            </div>
        </div>
    );
};

const OptionSection: React.FC<{
    id: number;
    option: MortgageProperties;
}> = (props: { id: number; option: MortgageProperties }) => {
    const { id, option } = props;
    const [housePrice, setHousePrice] = React.useState(option.housePrice);
    const [loanAmount, setLoanAmount] = React.useState(housePrice * 0.9);
    const useOneInterestRate = option.interestRate !== undefined;
    const [interestRate, setInterestRate] = React.useState(3.8);
    // const [mortgageTerm, setMortgageTerm] = React.useState(option.mortgageTerm);

    const handleLoanAmountChange = (
        loanAmount: number,
        housePrice: number,
        setLoanAmount: (loanAmount: number) => void
    ) => {
        if (loanAmount < 0) {
            setLoanAmount(0);
        } else if (loanAmount > housePrice * 0.9) {
            setLoanAmount(housePrice * 0.9);
        } else {
            setLoanAmount(loanAmount);
        }
    };

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
                    onChange={(e) => setHousePrice(parseInt(e.target.value))}
                />
            </label>

            <br />

            <label>
                Loan Amount (%)
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) =>
                        handleLoanAmountChange(
                            parseFloat(e.target.value),
                            housePrice,
                            setLoanAmount
                        )
                    }
                />
            </label>

            <button onClick={() => setLoanAmount(housePrice * 0.9)}>
                Set loan amount to 90%
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
                            option.interestRate ?? interestRate,
                            option.mortgageTerm
                        )
                    )}
                </p>
            </h3>
            <h3>
                Savings Required:{" "}
                <p>
                    {formatter.format(
                        housePrice -
                            loanAmount +
                            option.fees.valuationFee +
                            option.fees.surveyFee +
                            option.fees.legalFee +
                            housePrice * 0.01 + // stamp duty
                            option.fees.searchFee
                    )}
                </p>
            </h3>
        </div>
    );
};
