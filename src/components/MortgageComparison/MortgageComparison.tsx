import { Icon, Link, PrimaryButton, Stack, Text } from "@fluentui/react";
import React from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";
import { MortgageFees } from "../MortgageDetails/MortgageDetails.mapper";
import { FeesPanel } from "../FeesPanel/FeesPanel";

export interface MortgageComparisonProps {}

export const MortgageComparison: React.FC<MortgageComparisonProps> = () => {
    const [interestRate, setInterestRate] = React.useState<number | undefined>(
        4
    );
    const [useGlobalInterestRate, setUseGlobalInterestRate] =
        React.useState(true);

    const [maxLoan, setMaxLoan] = React.useState(0);

    const [term, setTerm] = React.useState(35);

    const [fees, setFees] = React.useState<MortgageFees>({
        valuationFee: 185,
        surveyFee: 600,
        // legalFee: 3382.5,
        legalFee: 3400,
        searchFee: 250,
        registerOfDeedsFee: 100,
        landRegistryFee: 975,
    });

    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    const containerStackStyles = {
        root: { alignItems: "center" },
    };
    const containerStackTokens = { childrenGap: 30 };
    const comparisonStackTokens = { childrenGap: 40 };

    return (
        <Stack styles={containerStackStyles} tokens={containerStackTokens}>
            <h1>Mortgage Comparison</h1>
            <InterestRate
                interestRate={interestRate}
                setInterestRate={setInterestRate}
                useGlobalInterestRate={useGlobalInterestRate}
                setUseGlobalInterestRate={setUseGlobalInterestRate}
            />

            <MaxLoanInput maxLoan={maxLoan} setMaxLoan={setMaxLoan} />

            <TermInput term={term} setTerm={setTerm} />

            <PrimaryButton onClick={() => setIsPanelOpen(true)}>
                View/Edit Fees
            </PrimaryButton>

            <Stack horizontal tokens={comparisonStackTokens} wrap>
                <MortgageOption
                    fees={fees}
                    id={1}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
                    fees={fees}
                    id={2}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
                    fees={fees}
                    id={3}
                    {...{ interestRate, useGlobalInterestRate, maxLoan, term }}
                />
            </Stack>

            <br />

            <Text variant="medium" style={{ maxWidth: "60%" }}>
                <strong>Disclaimer:</strong> This is a simple mortgage
                comparison tool that calculates monthly payments based on the
                interest rate, loan amount, and term. The numbers are all
                estimates based on my own experience and research. Always
                consult with a financial advisor before making any decisions.
            </Text>

            <Text variant="medium">
                If you found this useful, consider{" "}
                <Link
                    target="_blank"
                    href="https://www.buymeacoffee.com/ryanlynch"
                >
                    buying me a coffee! <Icon iconName="CoffeeScript" />{" "}
                </Link>
            </Text>

            <FeesPanel
                fees={fees}
                setFees={setFees}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
            />
        </Stack>
    );
};

interface MortgageOptionProps {
    fees: MortgageFees;
    id: number;
    interestRate: number | undefined;
    useGlobalInterestRate: boolean;
    maxLoan: number;
    term: number;
}

const MortgageOption: React.FC<MortgageOptionProps> = (
    props: MortgageOptionProps
) => {
    const { fees, id, interestRate, useGlobalInterestRate, maxLoan, term } =
        props;

    return (
        <Stack.Item grow>
            <Stack horizontalAlign="center">
                <h2>Option {id}</h2>

                <MortgageDetails
                    fees={fees}
                    interestRate={
                        useGlobalInterestRate ? interestRate : undefined
                    }
                    maxLoan={maxLoan}
                    term={term}
                />
            </Stack>
        </Stack.Item>
    );
};
