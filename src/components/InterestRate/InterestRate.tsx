import React from "react";
import { NumberInput } from "../NumberInput/NumberInput";
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
                {useGlobalInterestRate ? (
                    <NumberInput
                        value={interestRate ?? 0}
                        onChange={setInterestRate}
                        min={0}
                        max={100}
                        contentAfter="%"
                    />
                ) : (
                    <Input disabled value="" contentAfter="%" />
                )}
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
