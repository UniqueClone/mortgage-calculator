import {
    Button,
    Divider,
    Input,
    Label,
    Text,
    Tooltip,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
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

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: tokens.spacingVerticalL,
        minWidth: "300px",
    },
    inputContainer: {
        padding: tokens.spacingVerticalM,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS,
        alignItems: "center",
        width: "100%",
    },
    input: {
        width: "200px",
    },
    buttonContainer: {
        paddingTop: tokens.spacingVerticalM,
        paddingLeft: "26px",
        display: "flex",
        alignItems: "center",
    },
    savingsContainer: {
        display: "flex",
        alignItems: "center",
        paddingLeft: tokens.spacingHorizontalXXL,
    },
    monthlyPaymentContainer: {
        display: "flex",
        alignItems: "center",
    },
    highlightText: {
        color: "lightgreen",
    },
    tooltipContent: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS,
        alignItems: "flex-end",
    },
});

export const MortgageDetails: React.FC<MortgageDetailsProps> = (
    props: MortgageDetailsProps
) => {
    const styles = useStyles();
    const { id, fees, firstTimeBuyer, interestRate, maxLoan, term } = props;

    const [deposit, setDeposit] = React.useState<number>(0);
    const [setLoanTooltipVisible, setSetLoanTooltipVisible] = React.useState(false);
    const [savingsTooltipVisible, setSavingsTooltipVisible] = React.useState(false);

    const updateDeposit = (newValue: number) => {
        if (newValue < 0) {
            setDeposit(0);
        } else {
            setDeposit(newValue);
        }
    };

    const handleSetLoanKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSetLoanTooltipVisible(!setLoanTooltipVisible);
        } else if (event.key === 'Escape') {
            setSetLoanTooltipVisible(false);
        }
    };

    const handleSavingsKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSavingsTooltipVisible(!savingsTooltipVisible);
        } else if (event.key === 'Escape') {
            setSavingsTooltipVisible(false);
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

    const handleHouseValueChange = (newValue: string) => {
        if (newValue === "") {
            setHouseValue(0);
            return;
        } else if (isNaN(parseFloat(newValue))) {
            return;
        } else {
            setHouseValue(parseFloat(newValue));
        }
    };

    const handleLoanAmountChange = (newValue: string) => {
        if (newValue === "") {
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
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <Label htmlFor={`house-price-${id}`}>House Price</Label>
                <Input
                    id={`house-price-${id}`}
                    type="number"
                    className={styles.input}
                    value={houseValue.toString()}
                    onChange={(_e, data) => handleHouseValueChange(data.value)}
                    contentBefore="€"
                />
            </div>

            {interestRate === undefined && (
                <div className={styles.inputContainer}>
                    <Label htmlFor={`interest-rate-${id}`}>Interest Rate</Label>
                    <Input
                        id={`interest-rate-${id}`}
                        type="number"
                        className={styles.input}
                        value={localInterestRate?.toString() || ""}
                        onChange={(_e, data) => {
                            const value = data.value;
                            setLocalInterestRate(
                                value === "" ? 0 : parseFloat(value)
                            );
                        }}
                        contentAfter="%"
                    />
                </div>
            )}

            <div className={styles.inputContainer}>
                <Label htmlFor={`loan-amount-${id}`}>Loan Amount</Label>
                <Input
                    id={`loan-amount-${id}`}
                    type="number"
                    className={styles.input}
                    value={loanAmount.toString()}
                    onChange={(_e, data) => handleLoanAmountChange(data.value)}
                    contentBefore="€"
                />
            </div>

            <Text size={400} weight="semibold">
                OR
            </Text>

            <div className={styles.buttonContainer}>
                <Button
                    appearance="primary"
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
                </Button>
                <Tooltip
                    content="This is 90% of the house value for a first time buyer (80% otherwise), unless you have set a maximum loan amount above that is less than 90% (or 80%) of the house value. In that case, the maximum loan amount will be used."
                    relationship="description"
                >
                    <Button
                        appearance="transparent"
                        icon={<InfoRegular className={styles.highlightText} />}
                        aria-label="More information about setting loan to max"
                    />
                </Tooltip>
            </div>

            <Divider
                style={{
                    marginTop: tokens.spacingVerticalXL,
                }}
            />

            <Text size={500} as="h3">Savings Required</Text>

            <div className={styles.savingsContainer}>
                <Text size={500} className={styles.highlightText}>
                    {formatter.format(savingsRequired(houseValue, deposit, fees))}
                </Text>

                <Tooltip
                    content={
                        <div className={styles.tooltipContent}>
                            <Text>Deposit: {formatter.format(deposit)}</Text>
                            <Text>
                                Fees: {formatter.format(savingsRequired(0, 0, fees))}
                            </Text>
                            <Text>
                                Stamp Duty: {formatter.format(houseValue * 0.01)}
                            </Text>
                        </div>
                    }
                    relationship="description"
                >
                    <Button
                        appearance="transparent"
                        icon={<InfoRegular className={styles.highlightText} />}
                        aria-label="More information about savings required breakdown"
                    />
                </Tooltip>
            </div>

            <Text size={500} as="h3">Monthly Payment</Text>

            <div className={styles.monthlyPaymentContainer}>
                <Text size={500} className={styles.highlightText}>
                    {formatter.format(
                        getMonthlyPayment(
                            loanAmount,
                            interestRate ?? localInterestRate,
                            term
                        )
                    )}
                </Text>
            </div>
        </div>
    );
};
