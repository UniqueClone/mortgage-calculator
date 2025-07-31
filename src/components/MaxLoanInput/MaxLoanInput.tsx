import {
    Input,
    Label,
    Tooltip,
    Button,
    makeStyles,
} from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
import React from "react";

export interface MaxLoanInputProps {
    maxLoan: number;
    setMaxLoan: (newValue: number) => void;
}

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    labelContainer: {
        display: "flex",
        alignItems: "center",
    },
    input: {
        width: "200px",
    },
    infoIcon: {
        color: "lightgreen",
        cursor: "pointer",
    },
    tooltipButton: {
        height: "auto",
        border: "none",
        backgroundColor: "transparent",
    },
});

export const MaxLoanInput: React.FC<MaxLoanInputProps> = (
    props: MaxLoanInputProps
) => {
    const styles = useStyles();
    const { maxLoan, setMaxLoan } = props;

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer}>
                <Label htmlFor="max-loan-input">Max Loan</Label>

                <Tooltip
                    content="If you have your mortgage approval, you can put the max loan amount here. Note: This is not the house value, it is the house value minus your deposit."
                    relationship="description"
                >
                    <Button
                        appearance="transparent"
                        className={styles.tooltipButton}
                        icon={<InfoRegular className={styles.infoIcon} />}
                        aria-label="More information about max loan amount"
                    />
                </Tooltip>
            </div>
            <Input
                id="max-loan-input"
                type="number"
                className={styles.input}
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
        </div>
    );
};
