import { useState } from "react";
import "./MortgageCalculator.css";

const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
});

function MortgageCalculator(): JSX.Element {
    const [houseValue, setHouseValue] = useState<number>(452458.0); // Declare houseValue variable
    const [interestRate, setInterestRate] = useState<number>(3.8); // Declare interestRate variable
    const [loanTerm, setLoanTerm] = useState<number>(35); // Declare loanTerm variable
    const [fixedTerm, setFixedTerm] = useState<number>(4); // Declare fixedTerm variable

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform calculations or submit form data here
    };

    const onHouseValueChange = (value: number) => {
        if (value < 0) {
            setHouseValue(0);
        } else {
            setHouseValue(value);
        }
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
                            onHouseValueChange(parseFloat(e.target.value))
                        }
                    />
                </label>
                <br />
                <label>
                    Loan Amount (€):
                    <input
                        type="number"
                        value={
                            houseValue * 0.9 //.toFixed(2)
                        }
                        onChange={(e) =>
                            onHouseValueChange(parseFloat(e.target.value) / 0.9)
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
                <label>
                    Fixed Term (in years):
                    <input
                        type="number"
                        value={fixedTerm}
                        onChange={(e) => setFixedTerm(parseInt(e.target.value))}
                    />
                </label>
            </form>
            <h2>Monthly Payment</h2>
            <p
                style={{
                    color: "green",
                    fontSize: "24px",
                }}
            >
                {formatter.format(
                    getMonthlyPayment(houseValue * 0.9, interestRate, loanTerm)
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
                        interestRate,
                        loanTerm - fixedTerm
                    )
                )}
            </p>

            <h2>House Value</h2>
            <p
                style={{
                    color: "green",
                    fontSize: "24px",
                }}
            >
                {formatter.format(getCleanHouseValue(houseValue))}
            </p>

            <h2>Total Payment</h2>
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
                        interestRate
                    )
                )}
            </p>
        </div>
    );
}

const getMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    loanTerm: number
) => {
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        return 0;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const numerator =
        loanAmount *
        monthlyInterestRate *
        (1 + monthlyInterestRate) ** numberOfPayments;
    const denominator = (1 + monthlyInterestRate) ** numberOfPayments - 1;
    return parseFloat((numerator / denominator).toFixed(2));
};

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
