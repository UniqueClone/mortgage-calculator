import { TextField } from "@fluentui/react";

export interface InputFieldProps {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
}

export const InputField: React.FC<InputFieldProps> = (
    props: InputFieldProps
) => {
    return (
        <TextField
            label={props.label}
            value={props.value.toString()}
            onChange={(_e, newValue) => {
                if (newValue === undefined) {
                    return;
                }
                props.onChange(parseFloat(newValue));
            }}
        />
    );
};
