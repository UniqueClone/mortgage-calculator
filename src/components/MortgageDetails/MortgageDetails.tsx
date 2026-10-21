import {
    Button,
    Field,
    Input,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
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
        gap: tokens.spacingVerticalL,
        flexGrow: 1,
    },
    inputs: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
    },
    maxButton: {
        alignSelf: "flex-start",
    },
    results: {
        marginTop: "auto",
        paddingTop: tokens.spacingVerticalL,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
    },
    result: {
        display: "flex",
        flexDirection: "column",
    },
    resultLabel: {
        color: tokens.colorNeutralForeground3,
    },
    figure: {
        fontVariantNumeric: "tabular-nums",
    },
    primaryFigure: {
        fontVariantNumeric: "tabular-nums",
        color: tokens.colorBrandForeground1,
    },
    breakdown: {
        margin: `${tokens.spacingVerticalXS} 0 0`,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        rowGap: tokens.spacingVerticalXXS,
        columnGap: tokens.spacingHorizontalM,
        fontSize: tokens.fontSizeBase200,
        lineHeight: tokens.lineHeightBase200,
        color: tokens.colorNeutralForeground3,
        "& dd": {
            margin: 0,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
        },
    },
});

export const MortgageDetails: React.FC<MortgageDetailsProps> = (
    props: MortgageDetailsProps
) => {
    const styles = useStyles();
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
            <div className={styles.inputs}>
                <Field label="House price">
                    <Input
                        type="number"
                        min={0}
                        value={houseValue.toString()}
                        onChange={(_e, data) =>
                            handleHouseValueChange(data.value)
                        }
                        contentBefore="€"
                    />
                </Field>

                {interestRate === undefined && (
                    <Field label="Interest rate">
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.05}
                            value={localInterestRate?.toString() || ""}
                            onChange={(_e, data) => {
                                const value = data.value;
                                setLocalInterestRate(
                                    value === "" ? 0 : parseFloat(value)
                                );
                            }}
                            contentAfter="%"
                        />
                    </Field>
                )}

                <Field label="Loan amount">
                    <Input
                        type="number"
                        min={0}
                        value={loanAmount.toString()}
                        onChange={(_e, data) =>
                            handleLoanAmountChange(data.value)
                        }
                        contentBefore="€"
                    />
                </Field>

                <Button
                    className={styles.maxButton}
                    size="small"
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
            </div>

            <div className={styles.results}>
                <div className={styles.result}>
                    <Text size={200} className={styles.resultLabel}>
                        Monthly payment
                    </Text>
                    <Text
                        size={600}
                        weight="semibold"
                        className={styles.primaryFigure}
                        role="status"
                        aria-live="polite"
                    >
                        {formatter.format(
                            getMonthlyPayment(
                                loanAmount,
                                interestRate ?? localInterestRate,
                                term
                            )
                        )}
                    </Text>
                </div>

                <div className={styles.result}>
                    <Text size={200} className={styles.resultLabel}>
                        Savings needed
                    </Text>
                    <Text
                        size={400}
                        weight="semibold"
                        className={styles.figure}
                        role="status"
                        aria-live="polite"
                    >
                        {formatter.format(
                            savingsRequired(houseValue, deposit, fees)
                        )}
                    </Text>
                    <dl className={styles.breakdown}>
                        <dt>Deposit</dt>
                        <dd>{formatter.format(deposit)}</dd>
                        <dt>Fees</dt>
                        <dd>{formatter.format(savingsRequired(0, 0, fees))}</dd>
                        <dt>Stamp duty</dt>
                        <dd>{formatter.format(houseValue * 0.01)}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
};
