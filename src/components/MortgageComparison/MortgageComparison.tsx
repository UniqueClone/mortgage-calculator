import { Icon, Link, Stack, Text } from "@fluentui/react";
import React from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";

export interface MortgageComparisonProps {}

export const MortgageComparison: React.FC<MortgageComparisonProps> = () => {
    const [interestRate, setInterestRate] = React.useState<number | undefined>(
        4
    );
    const [useGlobalInterestRate, setUseGlobalInterestRate] =
        React.useState(true);

    const [maxLoan, setMaxLoan] = React.useState(0);

    const [term, setTerm] = React.useState(35);

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
            <Stack horizontal tokens={comparisonStackTokens} wrap>
                <MortgageOption
                    id={1}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
                    id={2}
                    interestRate={interestRate}
                    useGlobalInterestRate={useGlobalInterestRate}
                    maxLoan={maxLoan}
                    term={term}
                />

                <MortgageOption
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
        </Stack>
    );
};

interface MortgageOptionProps {
    id: number;
    interestRate: number | undefined;
    useGlobalInterestRate: boolean;
    maxLoan: number;
    term: number;
}

const MortgageOption: React.FC<MortgageOptionProps> = (
    props: MortgageOptionProps
) => {
    const { id, interestRate, useGlobalInterestRate, maxLoan, term } = props;

    return (
        <Stack.Item grow>
            <Stack horizontalAlign="center">
                <h2>Option {id}</h2>

                <MortgageDetails
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
