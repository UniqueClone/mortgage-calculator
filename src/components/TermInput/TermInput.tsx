import { Field, Input } from "@fluentui/react-components";
import React from "react";

export interface TermInputProps {
    term: number;
    setTerm: (newValue: number) => void;
}

export const TermInput: React.FC<TermInputProps> = (props: TermInputProps) => {
    return (
        <Field label="Term">
            <Input
                type="number"
                min={1}
                value={props.term.toString()}
                onChange={(_e, data) => {
                    const newValue = data.value;
                    if (newValue && !isNaN(parseFloat(newValue))) {
                        props.setTerm(parseFloat(newValue));
                    }
                }}
                contentAfter="years"
            />
        </Field>
    );
};
