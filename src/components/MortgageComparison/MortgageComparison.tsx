import {
    Checkbox,
    Button,
    Link,
    Text,
    makeStyles,
    tokens,
    Divider,
} from "@fluentui/react-components";
import { DrinkCoffeeRegular } from "@fluentui/react-icons";
import React, { useEffect } from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";
import { MortgageFees } from "../MortgageDetails/MortgageDetails.mapper";
import { FeesPanel } from "../FeesPanel/FeesPanel";
// import { appInsights } from "../../App";

export interface MortgageComparisonProps {}

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: tokens.spacingVerticalXXL,
        padding: tokens.spacingVerticalXL,
    },
    comparisonContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: tokens.spacingHorizontalXXXL,
        justifyContent: "center",
    },
    disclaimer: {
        width: "80%",
        textAlign: "center",
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
        <div className={styles.container}>
            <h1>Mortgage Comparison</h1>

            <span style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
            }}>
                <Checkbox
                    label="First Time Buyer?"
                    checked={firstTimeBuyer}
                    onChange={(_e, data) => {
                        setFirstTimeBuyer(data.checked === true);
                    }}
                    style={{
                        padding: 0,
                    }}
                />

                <InterestRate
                    interestRate={interestRate}
                    setInterestRate={setInterestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    setUseGlobalInterestRate={setUseGlobalInterestRate}
                />
            </span>

            <MaxLoanInput maxLoan={maxLoan} setMaxLoan={setMaxLoan} />

            <TermInput term={term} setTerm={setTerm} />

            <Button
                appearance="primary"
                onClick={() => setIsPanelOpen(true)}
            >
                View/Edit Fees
            </Button>

            <Divider />

            <div className={styles.comparisonContainer}>
                <MortgageOption
                    fees={fees}
                    firstTimeBuyer={firstTimeBuyer}
                    id={1}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
                    fees={fees}
                    firstTimeBuyer={firstTimeBuyer}
                    id={2}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
                    fees={fees}
                    firstTimeBuyer={firstTimeBuyer}
                    id={3}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />
            </div>

            <br />

            <Text className={styles.disclaimer} size={400}>
                <strong>Disclaimer:</strong> This is a simple mortgage
                comparison tool that calculates monthly payments based on the
                interest rate, loan amount, and term. The numbers are all estimates based on my own experience and research. Always
                consult with a financial advisor before making any decisions.
            </Text>

            <Text size={400}>
                If you found this useful, consider{" "}
                <Link
                    href="https://www.buymeacoffee.com/ryanlynch"
                    style={{ color: "rgb(33, 171, 56)" }}
                    target="_blank"
                >
                    buying me a coffee! <DrinkCoffeeRegular />{" "}
                </Link>
            </Text>

            <Text size={400}>
                If you have any feedback or suggestions, please{" "}
                <Link
                    href="mailto:ryanjetbox@gmail.com"
                    style={{
                        color: "rgb(33, 171, 56)",
                    }}
                >
                    send me an email{" "}
                </Link>
                or{" "}
                <Link
                    href="https://github.com/UniqueClone/mortgage-calculator/issues/new"
                    style={{
                        color: "rgb(33, 171, 56)",
                    }}
                >
                    open an issue on GitHub!
                </Link>
            </Text>

            <FeesPanel
                fees={fees}
                setFees={setFees}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
            />
        </div>
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
        alignItems: "center",
        flexGrow: 1,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRadius: tokens.borderRadiusMedium,
        padding: tokens.spacingVerticalM,
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
        <div className={styles.optionContainer}>
            <h2>Option {id}</h2>

            <MortgageDetails
                id={id}
                fees={fees}
                firstTimeBuyer={firstTimeBuyer}
                interestRate={
                    useGlobalInterestRate ? interestRate : undefined
                }
                maxLoan={maxLoan}
                term={term}
            />
        </div>
    );
};
