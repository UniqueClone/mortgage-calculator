import { Stack } from "@fluentui/react";
import React from "react";
import { InterestRate } from "../InterestRate/InterestRate";
import { MaxLoanInput } from "../MaxLoanInput/MaxLoanInput";
import { TermInput } from "../TermInput/TermInput";
import { MortgageDetails } from "../MortgageDetails/MortgageDetails";

export interface MortgageComparisonProps {}

export const MortgageComparison: React.FC<MortgageComparisonProps> = () => {
    const [interestRate, setInterestRate] = React.useState<number | undefined>(
        3.8
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
