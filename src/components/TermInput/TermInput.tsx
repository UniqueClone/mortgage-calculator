import { ITextFieldStyles, Slider, TextField } from "@fluentui/react";

export interface TermInputProps {
    term: number;
    setTerm: (newValue: number) => void;
    styles?: Partial<ITextFieldStyles>;
}

const defaultTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 200 },
};

export const TermInput: React.FC<TermInputProps> = (props: TermInputProps) => {
    return (
        <>
            <TextField
                label="Mortgage Term"
                onChange={(_e, newValue) => {
                    if (newValue === undefined) {
                        return;
                    }
                    props.setTerm(parseFloat(newValue));
                }}
                styles={props.styles ?? defaultTextFieldStyles}
                value={props.term.toString()}
                type="number"
                suffix="years"
            />

            {/* <Slider
                label="Test"
                min={0}
                max={35}
                step={1}
                value={props.term}
                onChange={props.setTerm}
                showValue
            /> */}
        </>
    );
};
