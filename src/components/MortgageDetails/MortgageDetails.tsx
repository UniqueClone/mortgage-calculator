import {
    Button,
    Field,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import React from "react";
import { OptionResult, formatter } from "./MortgageDetails.mapper";
import { MortgageOptionState, MortgageSettings } from "../../storage";
import { NumberInput } from "../NumberInput/NumberInput";

export interface MortgageDetailsProps {
    option: MortgageOptionState;
    onChange: (changes: Partial<MortgageOptionState>) => void;
    settings: MortgageSettings;
    result: OptionResult;
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
    const { option, onChange, settings, result } = props;
    const { housePrice, loanAmount } = option;
    const { loanWarning, savings } = result;

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

                {!settings.useGlobalInterestRate && (
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
                    onClick={() => onChange({ loanAmount: result.maxLoan })}
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
                        {formatter.format(result.monthlyPayment)}
                    </Text>
                    <dl className={styles.breakdown}>
                        {result.paymentsAfterRateRise.map(
                            ({ rise, monthlyPayment }) => (
                                <React.Fragment key={rise}>
                                    <dt>If rates rise {rise}%</dt>
                                    <dd>{formatter.format(monthlyPayment)}</dd>
                                </React.Fragment>
                            )
                        )}
                        <dt>Total interest</dt>
                        <dd>{formatter.format(result.totalInterest)}</dd>
                        <dt>Total repaid</dt>
                        <dd>{formatter.format(result.totalRepaid)}</dd>
                    </dl>
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
