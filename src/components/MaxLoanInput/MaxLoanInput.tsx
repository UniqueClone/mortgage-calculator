import { Field, Input } from "@fluentui/react-components";
import React from "react";

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
            <Input
                type="number"
                min={0}
                value={maxLoan.toString()}
                onChange={(_e, data) => {
                    const newValue = data.value;
                    if (newValue === "") {
                        setMaxLoan(0);
                    } else if (isNaN(parseFloat(newValue))) {
                        return;
                    } else if (parseFloat(newValue) <= 0) {
                        setMaxLoan(0);
                    } else {
                        setMaxLoan(parseFloat(newValue));
                    }
                }}
                contentBefore="€"
            />
        </Field>
    );
};
