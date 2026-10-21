import {
    Checkbox,
    Button,
    Link,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";
import { MortgageFees } from "../MortgageDetails/MortgageDetails.mapper";
import { FeesPanel } from "../FeesPanel/FeesPanel";

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
    },
    buyerAndFees: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: tokens.spacingVerticalS,
    },
    checkbox: {
        marginLeft: `calc(-1 * ${tokens.spacingHorizontalS})`,
    },
    hint: {
        color: tokens.colorNeutralForeground3,
        marginTop: `calc(-1 * ${tokens.spacingVerticalS})`,
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

    const savedMortgageDetails = localStorage.getItem("mortgageDetails");
    const parsedMortgageDetails = JSON.parse(savedMortgageDetails ?? "{}");

    const [firstTimeBuyer, setFirstTimeBuyer] = React.useState(true);

    const [interestRate, setInterestRate] = React.useState<number | undefined>(
        parsedMortgageDetails.interestRate ?? 4.0
    );
    const [useGlobalInterestRate, setUseGlobalInterestRate] = React.useState(
        parsedMortgageDetails.useGlobalInterestRate ?? true
    );

    const [maxLoan, setMaxLoan] = React.useState(
        parsedMortgageDetails.maxLoan ?? 0
    );

    const [term, setTerm] = React.useState(parsedMortgageDetails.term ?? 35);

    const [fees, setFees] = React.useState<MortgageFees>(
        parsedMortgageDetails.fees ?? {
            valuationFee: 185,
            surveyFee: 600,
            // legalFee: 3382.5,
            legalFee: 2800,
            searchFee: 250,
            registerOfDeedsFee: 100,
            landRegistryFee: 975,
        }
    );

    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    useEffect(() => {
        localStorage.setItem(
            "mortgageDetails",
            JSON.stringify({
                fees,
                interestRate,
                useGlobalInterestRate,
                maxLoan,
                term,
            })
        );
    }, [fees, interestRate, useGlobalInterestRate, maxLoan, term]);

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mortgage comparison</h1>
                <Text className={styles.subtitle}>
                    Compare monthly repayments and upfront costs for up to
                    three Irish mortgage scenarios.
                </Text>
            </header>

            <section aria-labelledby="settings-heading">
                <h2 id="settings-heading" className={styles.sectionHeading}>
                    Your mortgage
                </h2>
                <div className={styles.settings}>
                    <InterestRate
                        interestRate={interestRate}
                        setInterestRate={setInterestRate}
                        useGlobalInterestRate={useGlobalInterestRate}
                        setUseGlobalInterestRate={setUseGlobalInterestRate}
                    />

                    <MaxLoanInput maxLoan={maxLoan} setMaxLoan={setMaxLoan} />

                    <TermInput term={term} setTerm={setTerm} />

                    <div className={styles.buyerAndFees}>
                        <Checkbox
                            className={styles.checkbox}
                            label="First-time buyer"
                            checked={firstTimeBuyer}
                            onChange={(_e, data) => {
                                setFirstTimeBuyer(data.checked === true);
                            }}
                        />
                        <Text size={200} className={styles.hint}>
                            Loans are capped at {firstTimeBuyer ? "90%" : "80%"}{" "}
                            of the price, or your max loan if lower.
                        </Text>
                        <Button onClick={() => setIsPanelOpen(true)}>
                            Edit fees
                        </Button>
                    </div>
                </div>
            </section>

            <section aria-labelledby="options-heading">
                <h2 id="options-heading" className={styles.sectionHeading}>
                    Options
                </h2>
                <div
                    className={styles.comparisonContainer}
                    role="list"
                    aria-label="Mortgage options"
                >
                    {[1, 2, 3].map((id) => (
                        <MortgageOption
                            key={id}
                            fees={fees}
                            firstTimeBuyer={firstTimeBuyer}
                            id={id}
                            interestRate={interestRate}
                            useGlobalInterestRate={useGlobalInterestRate}
                            maxLoan={maxLoan}
                            term={term}
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
                setFees={setFees}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
            />
        </main>
    );
};

interface MortgageOptionProps {
    fees: MortgageFees;
    firstTimeBuyer: boolean;
    id: number;
    interestRate: number | undefined;
    useGlobalInterestRate: boolean;
    maxLoan: number;
    term: number;
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
    optionTitle: {
        margin: 0,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
    },
});

const MortgageOption: React.FC<MortgageOptionProps> = (
    props: MortgageOptionProps
) => {
    const styles = useMortgageOptionStyles();
    const {
        fees,
        firstTimeBuyer,
        id,
        interestRate,
        useGlobalInterestRate,
        maxLoan,
        term,
    } = props;

    return (
        <div
            className={styles.optionContainer}
            role="listitem"
            aria-label={`Mortgage option ${id}`}
        >
            <h3 className={styles.optionTitle}>Option {id}</h3>

            <MortgageDetails
                id={id}
                fees={fees}
                firstTimeBuyer={firstTimeBuyer}
                interestRate={useGlobalInterestRate ? interestRate : undefined}
                maxLoan={maxLoan}
                term={term}
            />
        </div>
    );
};
