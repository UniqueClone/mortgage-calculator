import {
    Badge,
    Button,
    Checkbox,
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
    lowestMonthly?: boolean;
    lowestSavings?: boolean;
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
    newBuild: {
        display: "flex",
        flexDirection: "column",
    },
    checkbox: {
        marginLeft: `calc(-1 * ${tokens.spacingHorizontalS})`,
    },
    note: {
        color: tokens.colorNeutralForeground3,
    },
    // Results sit in a lightly tinted panel along the bottom of the card, so
    // they read as outputs rather than more inputs.
    results: {
        marginTop: "auto",
        marginInline: `calc(-1 * ${tokens.spacingHorizontalL})`,
        marginBottom: `calc(-1 * ${tokens.spacingHorizontalL})`,
        padding: tokens.spacingHorizontalL,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        borderBottomLeftRadius: tokens.borderRadiusLarge,
        borderBottomRightRadius: tokens.borderRadiusLarge,
        backgroundColor: tokens.colorBrandBackground2,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
    },
    result: {
        display: "flex",
        flexDirection: "column",
    },
    resultLabelRow: {
        display: "flex",
        alignItems: "center",
        gap: tokens.spacingHorizontalS,
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
    props: MortgageDetailsProps,
) => {
    const styles = useStyles();
    const { option, onChange, settings, result, lowestMonthly, lowestSavings } =
        props;
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
                        zeroAsEmpty
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
                        zeroAsEmpty
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

                <div className={styles.newBuild}>
                    <Checkbox
                        className={styles.checkbox}
                        label="New build"
                        checked={option.newBuild}
                        onChange={(_e, data) =>
                            onChange({ newBuild: data.checked === true })
                        }
                    />
                    {option.newBuild && settings.firstTimeBuyer && (
                        <Text size={200} className={styles.note}>
                            {result.helpToBuy.ineligibleReason
                                ? `No Help to Buy: ${result.helpToBuy.ineligibleReason}`
                                : "Includes Help to Buy, which is also limited by the income tax you've paid in the last 4 years."}
                        </Text>
                    )}
                </div>
            </div>

            <div className={styles.results}>
                <div className={styles.result}>
                    <div className={styles.resultLabelRow}>
                        <Text size={200} className={styles.resultLabel}>
                            Monthly payment
                        </Text>
                        {lowestMonthly && <LowestBadge />}
                    </div>
                    <Text
                        size={600}
                        weight="semibold"
                        className={styles.primaryFigure}
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
                            ),
                        )}
                        <dt>Total interest</dt>
                        <dd>{formatter.format(result.totalInterest)}</dd>
                        <dt>Total repaid</dt>
                        <dd>{formatter.format(result.totalRepaid)}</dd>
                    </dl>
                </div>

                <div className={styles.result}>
                    <div className={styles.resultLabelRow}>
                        <Text size={200} className={styles.resultLabel}>
                            Savings needed
                        </Text>
                        {lowestSavings && <LowestBadge />}
                    </div>
                    <Text
                        size={400}
                        weight="semibold"
                        className={styles.figure}
                    >
                        {formatter.format(savings.total)}
                    </Text>
                    <dl className={styles.breakdown}>
                        <dt>Deposit</dt>
                        <dd>{formatter.format(savings.deposit)}</dd>
                        {savings.helpToBuy > 0 && (
                            <>
                                <dt>Help to Buy</dt>
                                <dd>−{formatter.format(savings.helpToBuy)}</dd>
                            </>
                        )}
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

const LowestBadge: React.FC = () => (
    <Badge appearance="tint" color="brand" size="small">
        Lowest
    </Badge>
);
