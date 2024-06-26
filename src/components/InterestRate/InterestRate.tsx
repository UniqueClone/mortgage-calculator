import { Checkbox, ITextFieldStyles, TextField } from "@fluentui/react";

export interface InterestRateProps {
    interestRate: number | undefined;
    setInterestRate: (newValue: number | undefined) => void;
    useGlobalInterestRate: boolean;
    setUseGlobalInterestRate: (newValue: boolean) => void;
}

export const InterestRate: React.FC<InterestRateProps> = (
    props: InterestRateProps
) => {
    const {
        interestRate,
        setInterestRate,
        useGlobalInterestRate,
        setUseGlobalInterestRate,
    } = props;

    const defaultTextFieldStyles: Partial<ITextFieldStyles> = {
        fieldGroup: { width: 200 },
    };

    const handleGlobalInterestRateChange = (checked: boolean) => {
        setUseGlobalInterestRate(checked);

        // if (!checked) {
        //     setInterestRate(undefined);
        // }
    };

    return (
        <>
            <Checkbox
                label="Use one interest rate?"
                checked={useGlobalInterestRate}
                onChange={(_e, checked) => {
                    if (checked === undefined) {
                        return;
                    }
                    handleGlobalInterestRateChange(checked);
                }}
            />

            {useGlobalInterestRate && (
                <TextField
                    type="number"
                    label="Interest Rate"
                    styles={defaultTextFieldStyles}
                    value={interestRate?.toString()}
                    onChange={(_e, newValue) => {
                        if (newValue === undefined) {
                            return;
                        } else if (newValue === "") {
                            setInterestRate(0);
                        } else if (isNaN(parseFloat(newValue))) {
                            return;
                        } else if (
                            parseFloat(newValue) <= 0 ||
                            parseFloat(newValue) > 100
                        ) {
                            setInterestRate(0);
                        } else {
                            setInterestRate(parseFloat(newValue));
                        }
                    }}
                    suffix="%"
                />
            )}
        </>
    );
};
