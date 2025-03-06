import {
    Icon,
    PrimaryButton,
    Stack,
    Text,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import React, { useEffect } from "react";
import {
    MortgageFees,
    formatter,
    getMonthlyPayment,
    savingsRequired,
    setLoanAmountToMax,
} from "./MortgageDetails.mapper";

export interface MortgageDetailsProps {
    id: number;
    fees: MortgageFees;
    firstTimeBuyer: boolean;
    interestRate: number | undefined;
    maxLoan: number;
    term: number;
}

export const MortgageDetails: React.FC<MortgageDetailsProps> = (
    props: MortgageDetailsProps
) => {
    const { id, fees, firstTimeBuyer, interestRate, maxLoan, term } = props;

    const [deposit, setDeposit] = React.useState<number>(0);

    const updateDeposit = (newValue: number) => {
        if (newValue < 0) {
            setDeposit(0);
        } else {
            setDeposit(newValue);
        }
    };

    const localStorageData = localStorage.getItem("mortgageOption" + id);

    const [localInterestRate, setLocalInterestRate] = React.useState<number>(
        localStorageData
            ? JSON.parse(localStorageData).interestRate
            : interestRate ?? 4.0
    );

    const [houseValue, setHouseValue] = React.useState<number>(
        localStorageData ? JSON.parse(localStorageData).houseValue : 0
    );

    const [loanAmount, setLoanAmount] = React.useState<number>(
        localStorageData ? JSON.parse(localStorageData).loanAmount : 0
    );

    const containerStackStyles = {
        root: { alignItems: "center" },
    };
    const containerStackTokens = { childrenGap: 30 };

    const handleHouseValueChange = (newValue: string | undefined) => {
        if (newValue === undefined) {
            return;
        } else if (newValue === "") {
            setHouseValue(0);
            return;
        } else if (isNaN(parseFloat(newValue))) {
            return;
        } else {
            setHouseValue(parseFloat(newValue));
        }
    };

    const handleLoanAmountChange = (newValue: string | undefined) => {
        if (newValue === undefined) {
            return;
        } else if (newValue === "") {
            setLoanAmount(0);
            return;
        } else if (isNaN(parseFloat(newValue))) {
            return;
        } else if (parseFloat(newValue) > maxLoan && maxLoan > 0) {
            setLoanAmount(maxLoan);
            return;
        } else if (parseFloat(newValue) < 0) {
            setLoanAmount(0);
            return;
        } else {
            setLoanAmount(parseFloat(newValue));
        }
    };

    useEffect(() => {
        localStorage.setItem(
            "mortgageOption" + id,
            JSON.stringify({ houseValue, loanAmount, localInterestRate })
        );
    }, [houseValue, loanAmount, localInterestRate, id]);

    useEffect(() => {
        updateDeposit(houseValue - loanAmount);
    }, [houseValue, loanAmount]);

    return (
        <Stack styles={containerStackStyles} tokens={containerStackTokens}>
            <Stack.Item grow>
                <TextField
                    label="House Price"
                    onChange={(_e, newValue) => {
                        handleHouseValueChange(newValue);
                    }}
                    prefix="€"
                    type="number"
                    value={houseValue.toString()}
                />
            </Stack.Item>

            {interestRate === undefined && (
                <Stack.Item grow>
                    <TextField
                        label="Interest Rate"
                        onChange={(_e, newValue) => {
                            setLocalInterestRate(
                                newValue === undefined
                                    ? 0
                                    : parseFloat(newValue)
                            );
                        }}
                        suffix="%"
                        type="number"
                        value={localInterestRate?.toString()}
                    />
                </Stack.Item>
            )}

            <Stack.Item grow>
                <TextField
                    label="Loan Amount"
                    onChange={(_e, newValue) => {
                        handleLoanAmountChange(newValue);
                    }}
                    prefix="€"
                    type="number"
                    value={loanAmount.toString()}
                />
            </Stack.Item>

            <Stack.Item
                grow
                style={{
                    margin: "0.5rem 0 0 0",
                }}
            >
                <Text variant="xxLarge">OR</Text>
            </Stack.Item>

            <Stack.Item
                grow
                style={{
                    margin: "0.5rem 0 0 0",
                }}
            >
                <PrimaryButton
                    onClick={() =>
                        setLoanAmountToMax(
                            firstTimeBuyer,
                            houseValue,
                            maxLoan,
                            setLoanAmount
                        )
                    }
                >
                    Set loan to max
                </PrimaryButton>{" "}
                <TooltipHost
                    className="tooltip"
                    content="This is 90% of the house value for a first time buyer (80% otherwise), unless you have set a maximum loan amount above that is less than 90% (or 80%) of the house value. In that case, the maximum loan amount will be used."
                    directionalHint={5}
                >
                    <Icon
                        iconName="Info"
                        style={{
                            fontSize: "0.85rem",
                            color: "lightgreen",
                        }}
                    />
                </TooltipHost>
            </Stack.Item>

            <Stack.Item grow>
                <Text variant="xxLarge">Savings Required: </Text>
            </Stack.Item>

            <Stack.Item grow aria-live="polite">
                <TooltipHost
                    className="tooltip"
                    tooltipProps={{
                        onRenderContent: () => (
                            <Stack
                                tokens={{ childrenGap: 10 }}
                                horizontalAlign="end"
                            >
                                <Text variant="medium">
                                    Deposit: {formatter.format(deposit)}
                                </Text>
                                <Text variant="medium">
                                    Fees:{" "}
                                    {formatter.format(
                                        savingsRequired(0, 0, fees)
                                    )}
                                </Text>
                                <Text variant="medium">
                                    Stamp Duty:{" "}
                                    {formatter.format(houseValue * 0.01)}
                                </Text>
                            </Stack>
                        ),
                    }}
                >
                    <Text
                        aria-label={`Savings Required: ${formatter.format(savingsRequired(houseValue, deposit, fees))}`}
                        variant="xLarge"
                        style={{ color: "lightgreen" }}
                    >
                        {formatter.format(
                            savingsRequired(houseValue, deposit, fees)
                        )}{" "}
                    </Text>
                    <Icon
                        iconName="Info"
                        style={{ fontSize: "0.85rem", color: "lightgreen" }}
                    />
                </TooltipHost>
            </Stack.Item>

            <Stack.Item grow>
                <Text id="monthly-payment" variant="xxLarge">
                    Monthly Payment:{" "}
                </Text>
            </Stack.Item>

            <Stack.Item aria-live="polite" grow>
                <Text
                    aria-label={`Monthly Payment: ${formatter.format(
                        getMonthlyPayment(
                            loanAmount,
                            interestRate ?? localInterestRate,
                            term
                        )
                    )}`}
                    variant="xLarge"
                    style={{ color: "lightgreen" }}
                >
                    {formatter.format(
                        getMonthlyPayment(
                            loanAmount,
                            interestRate ?? localInterestRate,
                            term
                        )
                    )}
                </Text>
            </Stack.Item>
        </Stack>
    );
};
