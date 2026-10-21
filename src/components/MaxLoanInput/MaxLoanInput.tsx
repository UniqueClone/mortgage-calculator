import { Field } from "@fluentui/react-components";
import React from "react";
import { NumberInput } from "../NumberInput/NumberInput";

export interface MaxLoanInputProps {
    maxLoan: number;
    setMaxLoan: (newValue: number) => void;
}

export const MaxLoanInput: React.FC<MaxLoanInputProps> = (
    props: MaxLoanInputProps
) => {
    const { maxLoan, setMaxLoan } = props;

    return (
        <Field
            label="Max loan"
            hint="From your approval in principle, or 0 if you have none. Loans are also capped at 90% of the price."
        >
            <NumberInput
                value={maxLoan}
                onChange={setMaxLoan}
                groupDigits
                contentBefore="€"
            />
        </Field>
    );
};
