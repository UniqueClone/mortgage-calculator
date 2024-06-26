import type { Meta, StoryObj } from "@storybook/react";
import {
    InputField,
    InputFieldProps,
} from "../../../components/InputField/InputField";

const meta: Meta<InputFieldProps> = {
    component: InputField,
};

export default meta;
type Story = StoryObj<InputFieldProps>;

export const DefaultInputField: Story = {
    args: {
        label: "Input Field",
        value: 0,
        onChange: (newValue: number) => {
            console.log(newValue);
        },
    },
};

export const InputFieldWithValue: Story = {
    args: {
        label: "Input Field",
        value: 100,
        onChange: (newValue: number) => {
            console.log(newValue);
        },
    },
};

export const InputFieldWithDifferentLabel: Story = {
    args: {
        label: "Different Label",
        value: 100,
        onChange: (newValue: number) => {
            console.log(newValue);
        },
    },
};

export const InputFieldyWithWideStyle: Story = {
    args: {
        label: "Wide Input Field",
        value: 100,
        onChange: (newValue: number) => {
            console.log(newValue);
        },
        styles: {
            fieldGroup: { width: 400 },
        },
    },
};
