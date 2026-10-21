import { Input, InputProps } from "@fluentui/react-components";
import React from "react";
import { clamp, formatNumber, parseNumberText } from "./numberText";

export interface NumberInputProps
    extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "type"> {
    value: number;
    onChange: (value: number) => void;
    /** Maximum digits after the decimal point. */
    decimals?: number;
    /** Show thousands separators when the field isn't being edited. */
    groupDigits?: boolean;
    min?: number;
    max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    decimals = 2,
    groupDigits = false,
    min,
    max,
    onFocus,
    onBlur,
    ...inputProps
}) => {
    // While focused, show exactly what the user typed so they can clear the
    // field or type "3." on the way to "3.5".
    const [editingText, setEditingText] = React.useState<string>();

    const displayText =
        editingText ?? formatNumber(value, decimals, groupDigits);

    return (
        <Input
            {...inputProps}
            type="text"
            inputMode={decimals > 0 ? "decimal" : "numeric"}
            value={displayText}
            onFocus={(e) => {
                // Start empty rather than "0" so typing doesn't give "0400000"
                setEditingText(
                    value === 0 ? "" : formatNumber(value, decimals, false)
                );
                onFocus?.(e);
            }}
            onChange={(_e, data) => {
                const parsed = parseNumberText(data.value, decimals);
                if (parsed === undefined) {
                    return;
                }
                setEditingText(data.value);
                onChange(parsed);
            }}
            onBlur={(e) => {
                setEditingText(undefined);
                const clamped = clamp(value, min, max);
                if (clamped !== value) {
                    onChange(clamped);
                }
                onBlur?.(e);
            }}
        />
    );
};
