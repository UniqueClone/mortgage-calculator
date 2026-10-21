import {
    Checkbox,
    Button,
    Field,
    Link,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import { Add20Regular, Dismiss20Regular } from "@fluentui/react-icons";
import React, { useEffect, useRef } from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";
import {
    OptionResult,
    calculateOption,
    formatter,
    loanToIncomeLimit,
    lowestPositive,
} from "../MortgageDetails/MortgageDetails.mapper";
import { NumberInput } from "../NumberInput/NumberInput";
import { useSettledAnnouncement } from "../../hooks/useSettledAnnouncement";
import { FeesPanel } from "../FeesPanel/FeesPanel";
import {
    MortgageOptionState,
    MortgageSettings,
    browserStorage,
    loadState,
    newOption,
    saveState,
} from "../../storage";

export interface MortgageComparisonProps {}

const useStyles = makeStyles({
    page: {
        maxWidth: "1080px",
        margin: "0 auto",
        padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXL}`,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXL,
        boxSizing: "border-box",
        "@media (max-width: 600px)": {
            padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalL}`,
        },
    },
    header: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXS,
    },
    title: {
        margin: 0,
        fontSize: tokens.fontSizeHero700,
        lineHeight: tokens.lineHeightHero700,
        fontWeight: tokens.fontWeightSemibold,
    },
    subtitle: {
        color: tokens.colorNeutralForeground3,
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.spacingHorizontalM,
        marginBottom: tokens.spacingVerticalM,
        "& h2": {
            marginBottom: 0,
        },
    },
    sectionHeading: {
        margin: `0 0 ${tokens.spacingVerticalM}`,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
    },
    settings: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
        alignItems: "start",
        "& .fui-Input": {
            minWidth: 0,
        },
    },
    buyerAndFees: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: tokens.spacingHorizontalXL,
        marginTop: tokens.spacingVerticalL,
    },
    checkbox: {
        marginLeft: `calc(-1 * ${tokens.spacingHorizontalS})`,
    },
    comparisonContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: tokens.spacingHorizontalL,
    },
    footer: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS,
        paddingTop: tokens.spacingVerticalL,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        color: tokens.colorNeutralForeground3,
        maxWidth: "70ch",
    },
});

export const MortgageComparison: React.FC<MortgageComparisonProps> = () => {
    const styles = useStyles();

    const [{ settings: initialSettings, options: initialOptions }] =
        React.useState(() =>
            loadState(browserStorage() ?? { getItem: () => null }),
        );

    const [settings, setSettings] =
        React.useState<MortgageSettings>(initialSettings);
    const [options, setOptions] =
        React.useState<MortgageOptionState[]>(initialOptions);
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    const {
        firstTimeBuyer,
        interestRate,
        useGlobalInterestRate,
        maxLoan,
        income,
        term,
        fees,
    } = settings;

    useEffect(() => {
        const storage = browserStorage();
        if (storage) {
            saveState(storage, { settings, options });
        }
    }, [settings, options]);

    const updateSettings = (changes: Partial<MortgageSettings>) =>
        setSettings((current) => ({ ...current, ...changes }));

    const updateOption = (id: number, changes: Partial<MortgageOptionState>) =>
        setOptions((current) =>
            current.map((option) =>
                option.id === id ? { ...option, ...changes } : option,
            ),
        );

    // Move focus somewhere sensible after adding or removing an option, since
    // the button that was pressed may no longer exist.
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const optionsListRef = useRef<HTMLDivElement>(null);
    const [focusTarget, setFocusTarget] = React.useState<number | "add">();

    useEffect(() => {
        if (focusTarget === "add") {
            addButtonRef.current?.focus();
        } else if (focusTarget !== undefined) {
            optionsListRef.current
                ?.querySelector<HTMLInputElement>(
                    `[data-option-id="${focusTarget}"] input`,
                )
                ?.focus();
        }
        setFocusTarget(undefined);
    }, [focusTarget]);

    const addOption = () => {
        const id = Math.max(0, ...options.map((option) => option.id)) + 1;
        setOptions([...options, newOption(id, interestRate)]);
        setFocusTarget(id);
    };

    const removeOption = (id: number) => {
        setOptions(options.filter((option) => option.id !== id));
        setFocusTarget("add");
    };

    const results = options.map((option) => calculateOption(option, settings));
    const lowestMonthly = lowestPositive(
        results.map((result) => result.monthlyPayment),
    );
    const lowestSavings = lowestPositive(
        results.map((result) =>
            result.monthlyPayment > 0 ? result.savings.total : 0,
        ),
    );

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mortgage comparison</h1>
                <Text className={styles.subtitle}>
                    Compare monthly repayments and upfront costs for Irish
                    mortgage scenarios side by side.
                </Text>
            </header>

            <section aria-labelledby="settings-heading">
                <h2 id="settings-heading" className={styles.sectionHeading}>
                    Your mortgage
                </h2>
                <div className={styles.settings}>
                    <InterestRate
                        interestRate={interestRate}
                        setInterestRate={(value) =>
                            updateSettings({ interestRate: value ?? 0 })
                        }
                        useGlobalInterestRate={useGlobalInterestRate}
                        setUseGlobalInterestRate={(value) =>
                            updateSettings({ useGlobalInterestRate: value })
                        }
                    />

                    <TermInput
                        term={term}
                        setTerm={(value) => updateSettings({ term: value })}
                    />

                    <Field
                        label="Gross income"
                        hint={`Yearly, combined, before tax. Loans are capped at ${loanToIncomeLimit(
                            firstTimeBuyer,
                        )}× income.`}
                    >
                        <NumberInput
                            value={income}
                            onChange={(value) =>
                                updateSettings({ income: value })
                            }
                            groupDigits
                            zeroAsEmpty
                            placeholder="Optional"
                            contentBefore="€"
                        />
                    </Field>

                    <MaxLoanInput
                        maxLoan={maxLoan}
                        setMaxLoan={(value) =>
                            updateSettings({ maxLoan: value })
                        }
                    />
                </div>

                <div className={styles.buyerAndFees}>
                    <Checkbox
                        className={styles.checkbox}
                        label="First-time buyer"
                        checked={firstTimeBuyer}
                        onChange={(_e, data) => {
                            updateSettings({
                                firstTimeBuyer: data.checked === true,
                            });
                        }}
                    />
                    <Button onClick={() => setIsPanelOpen(true)}>
                        Edit fees
                    </Button>
                </div>
            </section>

            <section aria-labelledby="options-heading">
                <div className={styles.sectionHeader}>
                    <h2 id="options-heading" className={styles.sectionHeading}>
                        Options
                    </h2>
                    <Button
                        ref={addButtonRef}
                        icon={<Add20Regular />}
                        onClick={addOption}
                        disabled={options.length >= MAX_OPTIONS}
                    >
                        Add option
                    </Button>
                </div>
                <div
                    ref={optionsListRef}
                    className={styles.comparisonContainer}
                    role="list"
                    aria-label="Mortgage options"
                >
                    {options.map((option, index) => (
                        <MortgageOption
                            key={option.id}
                            title={`Option ${index + 1}`}
                            option={option}
                            onChange={(changes) =>
                                updateOption(option.id, changes)
                            }
                            onRemove={
                                options.length > 1
                                    ? () => removeOption(option.id)
                                    : undefined
                            }
                            settings={settings}
                            result={results[index]}
                            lowestMonthly={lowestMonthly.has(index)}
                            lowestSavings={lowestSavings.has(index)}
                        />
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <Text size={200}>
                    These figures are estimates based on my own experience and
                    research, not financial advice. Always talk to a mortgage
                    adviser before making a decision.
                </Text>
                <Text size={200}>
                    Found this useful?{" "}
                    <Link
                        href="https://www.buymeacoffee.com/ryanlynch"
                        target="_blank"
                    >
                        Buy me a coffee
                    </Link>
                    . Feedback or ideas?{" "}
                    <Link href="mailto:ryanjetbox@gmail.com">Email me</Link> or{" "}
                    <Link href="https://github.com/UniqueClone/mortgage-calculator/issues/new">
                        open an issue on GitHub
                    </Link>
                    .
                </Text>
            </footer>

            <FeesPanel
                fees={fees}
                setFees={(value) => updateSettings({ fees: value })}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
            />
        </main>
    );
};

const MAX_OPTIONS = 6;

interface MortgageOptionProps {
    title: string;
    option: MortgageOptionState;
    onChange: (changes: Partial<MortgageOptionState>) => void;
    onRemove?: () => void;
    settings: MortgageSettings;
    result: OptionResult;
    lowestMonthly: boolean;
    lowestSavings: boolean;
}

const useMortgageOptionStyles = makeStyles({
    optionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
        padding: tokens.spacingHorizontalL,
        borderRadius: tokens.borderRadiusLarge,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: tokens.colorNeutralBackground1,
    },
    visuallyHidden: {
        position: "absolute",
        width: "1px",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
    },
    optionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "32px",
    },
    optionTitle: {
        margin: 0,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
    },
});

const MortgageOption: React.FC<MortgageOptionProps> = (
    props: MortgageOptionProps,
) => {
    const styles = useMortgageOptionStyles();
    const { title, option, onChange, onRemove, ...detailsProps } = props;
    const { result } = detailsProps;

    const announcement = useSettledAnnouncement(
        `${title}: monthly payment ${formatter.format(
            result.monthlyPayment,
        )}, savings needed ${formatter.format(result.savings.total)}.`,
    );

    return (
        <div
            className={styles.optionContainer}
            role="listitem"
            aria-label={title}
            data-option-id={option.id}
        >
            <div className={styles.optionHeader}>
                <h3 className={styles.optionTitle}>{title}</h3>
                {onRemove && (
                    <Button
                        appearance="subtle"
                        size="small"
                        icon={<Dismiss20Regular />}
                        aria-label={`Remove ${title}`}
                        title={`Remove ${title}`}
                        onClick={onRemove}
                    />
                )}
            </div>

            <MortgageDetails
                option={option}
                onChange={onChange}
                {...detailsProps}
            />

            <div className={styles.visuallyHidden} aria-live="polite">
                {announcement}
            </div>
        </div>
    );
};
