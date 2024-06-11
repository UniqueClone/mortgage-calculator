import { ITextFieldStyles, TextField } from "@fluentui/react";

export interface InputFieldProps {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    styles?: Partial<ITextFieldStyles>;
}

const defaultTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 200 },
};

export const InputField: React.FC<InputFieldProps> = (
    props: InputFieldProps
) => {
    return (
        <TextField
            label={props.label}
            onChange={(_e, newValue) => {
                if (newValue === undefined) {
                    return;
                }
                props.onChange(parseFloat(newValue));
            }}
            styles={props.styles ?? defaultTextFieldStyles}
            value={props.value.toString()}
        />
    );
};
