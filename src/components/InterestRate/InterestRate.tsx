import React from "react";
import {
    Checkbox,
    Field,
    Input,
    makeStyles,
    tokens,
} from "@fluentui/react-components";

export interface InterestRateProps {
    interestRate: number | undefined;
    setInterestRate: (newValue: number | undefined) => void;
    useGlobalInterestRate: boolean;
    setUseGlobalInterestRate: (newValue: boolean) => void;
}

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXS,
    },
    checkbox: {
        marginLeft: `calc(-1 * ${tokens.spacingHorizontalS})`,
    },
});

export const InterestRate: React.FC<InterestRateProps> = (
    props: InterestRateProps
) => {
    const styles = useStyles();
    const {
        interestRate,
        setInterestRate,
        useGlobalInterestRate,
        setUseGlobalInterestRate,
    } = props;

    const handleGlobalInterestRateChange = (checked: boolean) => {
        setUseGlobalInterestRate(checked);
    };

    return (
        <div className={styles.container}>
            <Field
                label="Interest rate"
                hint={
                    useGlobalInterestRate
                        ? undefined
                        : "Set separately for each option"
                }
            >
                <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.05}
                    disabled={!useGlobalInterestRate}
                    value={
                        useGlobalInterestRate
                            ? interestRate?.toString() || ""
                            : ""
                    }
                    onChange={(_e, data) => {
                        const newValue = data.value;
                        if (newValue === "") {
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
                    contentAfter="%"
                />
            </Field>

            <Checkbox
                className={styles.checkbox}
                label="Same rate for all options"
                checked={useGlobalInterestRate}
                onChange={(_e, data) => {
                    handleGlobalInterestRateChange(data.checked === true);
                }}
            />
        </div>
    );
};
