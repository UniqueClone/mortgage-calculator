import { Input, Label, makeStyles } from "@fluentui/react-components";
import React from "react";

export interface TermInputProps {
    term: number;
    setTerm: (newValue: number) => void;
}

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
    },
    input: {
        width: "220px",
        maxWidth: "100%",
    },
});

export const TermInput: React.FC<TermInputProps> = (props: TermInputProps) => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Label htmlFor="term-input">Mortgage Term</Label>
            <Input
                id="term-input"
                type="number"
                min={1}
                className={styles.input}
                value={props.term.toString()}
                onChange={(_e, data) => {
                    const newValue = data.value;
                    if (newValue && !isNaN(parseFloat(newValue))) {
                        props.setTerm(parseFloat(newValue));
                    }
                }}
                contentAfter="years"
            />
        </div>
    );
};
