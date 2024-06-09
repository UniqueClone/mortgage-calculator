import { useState } from "react";
import "./MortgageCalculator.css";
import {
    formatter,
    getMonthlyPayment,
    savingsRequired,
} from "./MortgageCalculator.mapper";
import ComparisonPage from "./ComparisonPage/ComparisonPage";

function MortgageCalculator(): JSX.Element {
    const [houseValue, setHouseValue] = useState<number>(0.0); // Declare houseValue variable
    const [interestRate, setInterestRate] = useState<number>(3.8); // Declare interestRate variable
    const [loanTerm, setLoanTerm] = useState<number>(35); // Declare loanTerm variable
    const [fixedTerm, setFixedTerm] = useState<number>(4); // Declare fixedTerm variable
    const [interestRateAfterFixedTerm, setInterestRateAfterFixedTerm] =
        useState<number>(3.95); // Declare interestRateAfterFixedTerm variable

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform calculations or submit form data here
    };

    const onHouseValueChange = (value: number) => {
        if (isNaN(value) || value < 0) {
            setHouseValue(0);
        } else {
            setHouseValue(value);
        }
    };

    return (
        <div>
            <h1>Mortgage Calculator</h1>
            <form className="columns" onSubmit={handleSubmit}>
                <div className="column column-1">
                    <label>
                        House Value (€):
                        <br />
                        <input
                            type="number"
                            value={houseValue}
                            onChange={(e) =>
                                onHouseValueChange(parseFloat(e.target.value))
                            }
                        />
                    </label>
                    <br />
                    <label>
                        Loan Amount (€):
                        <br />
                        <input
                            type="number"
                            value={
                                houseValue * 0.9 //.toFixed(2)
                            }
                            onChange={(e) =>
                                onHouseValueChange(
                                    parseFloat(e.target.value) / 0.9
                                )
                            }
                        />
                    </label>
                    <br />
                    <label>
                        Loan Term (in years):
                        <br />
                        <input
                            type="number"
                            value={loanTerm}
                            onChange={(e) =>
                                setLoanTerm(parseInt(e.target.value))
                            }
                        />
                    </label>
                    <br />
                </div>

                <div className="column column-2">
                    <label>
                        Interest Rate (%):
                        <br />
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(parseFloat(e.target.value))
                            }
                            onWheel={(e) =>
                                setInterestRate(
                                    Number(
                                        (
                                            interestRate +
                                            (e.deltaY > 0 ? -0.1 : 0.1)
                                        ).toFixed(2)
                                    )
                                )
                            }
                        />
                    </label>
                    <br />
                    <label>
                        Fixed Term (in years):
                        <br />
                        <input
                            type="number"
                            value={fixedTerm}
                            onChange={(e) =>
                                setFixedTerm(parseInt(e.target.value))
                            }
                        />
                    </label>
                    <br />
                    <label>
                        Interest Rate after Fixed Term (%):
                        <br />
                        <input
                            type="number"
                            value={interestRateAfterFixedTerm}
                            onChange={(e) =>
                                setInterestRateAfterFixedTerm(
                                    parseFloat(e.target.value)
                                )
                            }
                            // onWheel={(e) =>
                            //     setInterestRateAfterFixedTerm(
                            //         Number(
                            //             (
                            //                 interestRateAfterFixedTerm +
                            //                 (e.deltaY > 0 ? -0.1 : 0.1)
                            //             ).toFixed(2)
                            //         )
                            //     )
                            // }
                        />
                    </label>
                </div>
            </form>

            <h2 style={{ fontSize: "1.5rem" }}>Savings Required</h2>
            <p
                style={{
                    color: "green",
                    fontSize: "1.5rem",
                }}
            >
                {formatter.format(
                    savingsRequired(houseValue * 0.1, {
                        valuationFee: 185,
                        surveyFee: 500,
                        legalFee: 3300,
                        stampDuty: houseValue * 0.01,
                        searchFee: 250,
                        registerOfDeedsFee: 100,
                        landRegistryFee: 975,
                    })
                )}
            </p>

            <div className="columns">
                <div className="column column-1">
                    <h2>Monthly Payment</h2>
                    <p
                        style={{
                            color: "green",
                            fontSize: "24px",
                        }}
                    >
                        {formatter.format(
                            getMonthlyPayment(
                                houseValue * 0.9,
                                interestRate,
                                loanTerm
                            )
                        )}
                    </p>

                    <h2>Monthly Payment after Fixed Term</h2>
                    <p
                        style={{
                            color: "green",
                            fontSize: "24px",
                        }}
                    >
                        {formatter.format(
                            getMonthlyPayment(
                                houseValue * 0.9,
                                interestRateAfterFixedTerm,
                                loanTerm - fixedTerm
                            )
                        )}
                    </p>
                </div>

                <div className="column column-2">
                    <h2>House Value</h2>
                    <p
                        style={{
                            color: "green",
                            fontSize: "24px",
                        }}
                    >
                        {formatter.format(getCleanHouseValue(houseValue))}
                    </p>

                    <h2>Total Cost</h2>
                    <p
                        style={{
                            color: "green",
                            fontSize: "24px",
                        }}
                    >
                        {formatter.format(
                            getTotalPayment(
                                houseValue * 0.9,
                                interestRate,
                                loanTerm,
                                fixedTerm,
                                interestRateAfterFixedTerm
                            )
                        )}
                    </p>
                </div>
            </div>
            <ComparisonPage />
        </div>
    );
}

const getTotalPayment = (
    loanAmount: number,
    interestRate: number,
    loanTerm: number,
    fixedTerm: number,
    interestRateAfterFixedTerm: number
) => {
    if (
        isNaN(loanAmount) ||
        isNaN(interestRate) ||
        isNaN(loanTerm) ||
        isNaN(fixedTerm) ||
        isNaN(interestRateAfterFixedTerm)
    ) {
        return 0;
    }

    const monthlyPayment = getMonthlyPayment(
        loanAmount,
        interestRate,
        loanTerm
    );
    const fixedTermPayments = fixedTerm * 12;
    const fixedTermPayment = monthlyPayment * fixedTermPayments;
    const remainingLoanAmount = loanAmount - fixedTermPayment;
    const remainingMonthlyPayment = getMonthlyPayment(
        remainingLoanAmount,
        interestRateAfterFixedTerm,
        loanTerm - fixedTerm
    );
    const remainingTermPayments = (loanTerm - fixedTerm) * 12;
    return parseFloat(
        (
            fixedTermPayment +
            remainingMonthlyPayment * remainingTermPayments
        ).toFixed(2)
    );
};

const getCleanHouseValue = (houseValue: number) => {
    if (isNaN(houseValue)) {
        return 0;
    }

    return houseValue;
};

export default MortgageCalculator;
