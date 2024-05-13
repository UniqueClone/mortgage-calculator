import { useState } from "react";
import "./MortgageCalculator.css";

const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
});

function MortgageCalculator(): JSX.Element {
    const [houseValue, setHouseValue] = useState<number>(452458.0); // Declare houseValue variable
    const [loanAmount, setLoanAmount] = useState<number>(houseValue * 0.9); // Declare loanAmount variable
    const [interestRate, setInterestRate] = useState<number>(3.8); // Declare interestRate variable
    const [loanTerm, setLoanTerm] = useState<number>(35); // Declare loanTerm variable

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform calculations or submit form data here
    };

    const setHouseAndLoanAmount = (value: number) => {
        setHouseValue(value);
        setLoanAmount(parseFloat((value * 0.9).toFixed(2)));
    };

    const setLoanAndHouseValue = (value: number) => {
        setLoanAmount(value);
        // setHouseValue(parseFloat((value / 0.9).toFixed(2)));
        setHouseValue(value / 0.9);
    };

    return (
        <div>
            <h1>Mortgage Calculator</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    House Value (€):
                    <input
                        type="number"
                        value={houseValue}
                        onChange={(e) =>
                            setHouseAndLoanAmount(parseInt(e.target.value))
                        }
                        // readOnly
                    />
                </label>
                <br />
                <label>
                    Loan Amount (€):
                    <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) =>
                            setLoanAndHouseValue(parseInt(e.target.value))
                        }
                    />
                </label>
                <br />
                <label>
                    Interest Rate (%):
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
                    Loan Term (in years):
                    <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    />
                </label>
                <br />
                {/* <button type="submit">Calculate</button> */}
            </form>

            {/* <h2>Results</h2>
            <p>Loan Amount: {formatter.format(loanAmount)}</p>
            <p>Interest Rate: {interestRate.toFixed(2)}%</p>
            <p>Loan Term: {loanTerm}</p> */}

            <h2>Monthly Payment</h2>
            <p
                style={{
                    color: "green",
                    fontSize: "24px",
                }}
            >
                {formatter.format(
                    monthlyPayment(loanAmount, interestRate, loanTerm)
                )}
            </p>

            <h2>House Value</h2>
            <p
                style={{
                    color: "green",
                    fontSize: "24px",
                }}
            >
                {formatter.format((loanAmount / 9) * 10)}
            </p>
        </div>
    );
}

/**
 * Calculate the monthly payment for a mortgage.
 * @param loanAmount The total amount of the loan.
 * @param interestRate The annual interest rate for the loan.
 * @param loanTerm The term of the loan in years.
 * @returns The monthly payment amount.
 */
function monthlyPayment(
    loanAmount: number,
    interestRate: number,
    loanTerm: number
): number {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const numerator =
        loanAmount *
        monthlyInterestRate *
        (1 + monthlyInterestRate) ** numberOfPayments;
    const denominator = (1 + monthlyInterestRate) ** numberOfPayments - 1;
    return parseFloat((numerator / denominator).toFixed(2));
}

export default MortgageCalculator;
