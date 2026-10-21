import {
    Button,
    Field,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import React from "react";
import {
    MortgageFees,
    formatter,
    getMonthlyPayment,
    maxLoanAmount,
    savingsRequired,
} from "./MortgageDetails.mapper";
import { MortgageOptionState } from "../../storage";
import { NumberInput } from "../NumberInput/NumberInput";

export interface MortgageDetailsProps {
    option: MortgageOptionState;
    onChange: (changes: Partial<MortgageOptionState>) => void;
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
    const { option, onChange, fees, interestRate, maxLoan, term } = props;
    const { housePrice, loanAmount } = option;

    const maxLoanForPrice = maxLoanAmount(housePrice, maxLoan);
    const savings = savingsRequired(housePrice, loanAmount, fees);

    let loanWarning: string | undefined;
    if (housePrice > 0 && loanAmount > housePrice) {
        loanWarning = "More than the house price.";
    } else if (housePrice > 0 && loanAmount > maxLoanForPrice) {
        loanWarning = `Above the maximum of ${formatter.format(
            maxLoanForPrice
        )}.`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputs}>
                <Field label="House price">
                    <NumberInput
                        value={housePrice}
                        onChange={(value) => onChange({ housePrice: value })}
                        groupDigits
                        contentBefore="€"
                    />
                </Field>

                {interestRate === undefined && (
                    <Field label="Interest rate">
                        <NumberInput
                            value={option.interestRate}
                            onChange={(value) =>
                                onChange({ interestRate: value })
                            }
                            min={0}
                            max={100}
                            contentAfter="%"
                        />
                    </Field>
                )}

                <Field
                    label="Loan amount"
                    validationState={loanWarning ? "warning" : "none"}
                    validationMessage={loanWarning}
                >
                    <NumberInput
                        value={loanAmount}
                        onChange={(value) => onChange({ loanAmount: value })}
                        groupDigits
                        contentBefore="€"
                    />
                </Field>

                <Button
                    className={styles.maxButton}
                    size="small"
                    onClick={() => onChange({ loanAmount: maxLoanForPrice })}
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
                                interestRate ?? option.interestRate,
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
                        {formatter.format(savings.total)}
                    </Text>
                    <dl className={styles.breakdown}>
                        <dt>Deposit</dt>
                        <dd>{formatter.format(savings.deposit)}</dd>
                        <dt>Fees</dt>
                        <dd>{formatter.format(savings.fees)}</dd>
                        <dt>Stamp duty</dt>
                        <dd>{formatter.format(savings.stampDuty)}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
};
