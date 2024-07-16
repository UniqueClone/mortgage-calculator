import {
    ITextFieldStyles,
    Icon,
    TextField,
    TooltipHost,
} from "@fluentui/react";

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
            onRenderLabel={() => {
                return (
                    <div>
                        Max Loan{" "}
                        <TooltipHost
                            className="tooltip"
                            content="If you have your mortgage approval, you can put the max loan amount here. 
                            Note: This is not the house value, it is the house value minus your deposit."
                            id="maxLoanTooltip"
                        >
                            <Icon
                                iconName="Info"
                                style={{ fontSize: "0.7778rem" }}
                            />
                        </TooltipHost>
                    </div>
                );
            }}
            styles={defaultTextFieldStyles}
            value={maxLoan.toString()}
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
