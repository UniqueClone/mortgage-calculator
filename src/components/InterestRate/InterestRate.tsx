import React from "react";
import { Checkbox, Input, Label, makeStyles } from "@fluentui/react-components";

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
        gap: "16px",
        alignItems: "center",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
    },
    input: {
        width: "200px",
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
            <Checkbox
                label="Use one interest rate?"
                checked={useGlobalInterestRate}
                onChange={(_e, data) => {
                    handleGlobalInterestRateChange(data.checked === true);
                }}
            />

            {useGlobalInterestRate && (
                <div className={styles.inputContainer}>
                    <Label htmlFor="interest-rate-input">Interest Rate</Label>
                    <Input
                        id="interest-rate-input"
                        type="number"
                        className={styles.input}
                        value={interestRate?.toString() || ""}
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
                </div>
            )}
        </div>
    );
};
