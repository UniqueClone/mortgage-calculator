import { Field } from "@fluentui/react-components";
import React from "react";
import { NumberInput } from "../NumberInput/NumberInput";

export interface TermInputProps {
    term: number;
    setTerm: (newValue: number) => void;
}

export const TermInput: React.FC<TermInputProps> = (props: TermInputProps) => {
    return (
        <Field label="Term">
            <NumberInput
                value={props.term}
                onChange={props.setTerm}
                decimals={0}
                min={1}
                max={40}
                contentAfter="years"
            />
        </Field>
    );
};
