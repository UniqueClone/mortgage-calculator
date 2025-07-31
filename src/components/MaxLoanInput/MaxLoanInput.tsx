import {
    ITextFieldStyles,
    Icon,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import React from "react";

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

    const [tooltipVisible, setTooltipVisible] = React.useState(false);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setTooltipVisible(!tooltipVisible);
        } else if (event.key === 'Escape') {
            setTooltipVisible(false);
        }
    };

    return (
        <TextField
            type="number"
            onRenderLabel={() => {
                return (
                    <div style={{ cursor: "default" }}>
                        Max Loan{" "}
                        <TooltipHost
                            className="tooltip"
                            content="If you have your mortgage approval, you can put the max loan amount here. 
                            Note: This is not the house value, it is the house value minus your deposit."
                            id="maxLoanTooltip"
                            calloutProps={{
                                isBeakVisible: true,
                                directionalHint: 5,
                            }}
                        >
                            <Icon
                                iconName="Info"
                                style={{
                                    fontSize: "0.85rem",
                                    color: "lightgreen",
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label="More information about max loan amount"
                                aria-describedby="maxLoanTooltip"
                                onKeyDown={handleKeyDown}
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
