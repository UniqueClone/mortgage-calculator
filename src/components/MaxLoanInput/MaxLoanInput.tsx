import { ITextFieldStyles, TextField } from "@fluentui/react";

export interface MaxLoanInputProps {
    maxLoan: number;
    setMaxLoan: (newValue: number) => void;
}

export const MaxLoanInput: React.FC<MaxLoanInputProps> = (
    props: MaxLoanInputProps
) => {
    const { maxLoan, setMaxLoan } = props;

    const defaultTextFieldStyles: Partial<ITextFieldStyles> = {
        fieldGroup: { width: 200 },
    };

    return (
        <TextField
            type="number"
            label="Max Loan"
            styles={defaultTextFieldStyles}
            value={maxLoan}
            onChange={(_e, newValue) => {
                if (newValue === undefined) {
                    return;
                } else if (newValue === "") {
                    setMaxLoan(0);
                } else if (isNaN(parseFloat(newValue))) {
                    return;
                } else if (parseFloat(newValue) <= 0) {
                    setMaxLoan(0);
                } else {
                    setMaxLoan(parseFloat(newValue));
                }
            }}
            prefix="€"
        />
    );
};
