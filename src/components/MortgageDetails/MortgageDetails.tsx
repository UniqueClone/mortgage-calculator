import {
    PrimaryButton,
    Stack,
    Text,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import React from "react";
import {
    MortgageFees,
    formatter,
    getMonthlyPayment,
    savingsRequired,
    setLoanAmountToMax,
} from "./MortgageDetails.mapper";

export interface MortgageDetailsProps {
    interestRate: number | undefined;
    maxLoan: number;
    term: number;
}

export const MortgageDetails: React.FC<MortgageDetailsProps> = (
    props: MortgageDetailsProps
) => {
    const { interestRate, maxLoan, term } = props;
    const [localInterestRate, setLocalInterestRate] = React.useState<
        number | undefined
    >(interestRate ?? 4.0);
    const [houseValue, setHouseValue] = React.useState<number>(455028);
    const [loanAmount, setLoanAmount] = React.useState<number>(407213);

    const containerStackStyles = {
        root: { alignItems: "center" },
    };
    const containerStackTokens = { childrenGap: 30 };

    const fees: MortgageFees = {
        valuationFee: 185,
        surveyFee: 600,
        legalFee: 3382.5,
        searchFee: 250,
        registerOfDeedsFee: 100,
        landRegistryFee: 975,
    };

    const handleLoanAmountChange = (newValue: string | undefined) => {
        if (newValue === undefined) {
            return;
        } else if (newValue === "") {
            setLoanAmount(0);
            return;
        } else if (isNaN(parseFloat(newValue))) {
            return;
        } else if (parseFloat(newValue) > maxLoan) {
            setLoanAmount(maxLoan);
            return;
        } else if (parseFloat(newValue) < 0) {
            setLoanAmount(0);
            return;
        } else {
            setLoanAmount(parseFloat(newValue));
        }
    };

    return (
        <Stack styles={containerStackStyles} tokens={containerStackTokens}>
            <Stack.Item grow>
                <TextField
                    defaultValue={"0"}
                    label="House Price"
                    onChange={(_e, newValue) => {
                        if (newValue === undefined) {
                            return;
                        } else if (isNaN(parseFloat(newValue))) {
                            return;
                        } else {
                            setHouseValue(parseFloat(newValue));
                        }
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

            <Stack.Item grow>
                <TooltipHost
                    content="The maximum loan amount you can borrow is 90% of the house value, or the max loan amount you have set."
                    directionalHint={5}
                >
                    <PrimaryButton
                        onClick={() =>
                            setLoanAmountToMax(
                                houseValue,
                                maxLoan,
                                setLoanAmount
                            )
                        }
                    >
                        Set loan to max
                    </PrimaryButton>
                </TooltipHost>
            </Stack.Item>

            <Stack.Item grow>
                <Text variant="xxLarge">Savings Required: </Text>
            </Stack.Item>

            <Stack.Item grow>
                <Text variant="xLarge" style={{ color: "lightgreen" }}>
                    {formatter.format(
                        savingsRequired(
                            houseValue,
                            houseValue - loanAmount,
                            fees
                        )
                    )}
                </Text>
            </Stack.Item>

            <Stack.Item grow>
                <Text variant="xxLarge">Monthly Payment: </Text>
            </Stack.Item>

            <Stack.Item grow>
                <Text variant="xLarge" style={{ color: "lightgreen" }}>
                    {formatter.format(
                        getMonthlyPayment(loanAmount, interestRate ?? 3.8, term)
                    )}
                </Text>
            </Stack.Item>
        </Stack>
    );
};
