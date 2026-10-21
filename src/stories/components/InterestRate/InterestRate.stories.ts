import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { InterestRate } from "../../../components/InterestRate/InterestRate";

const meta: Meta<typeof InterestRate> = {
    component: InterestRate,
    args: {
        setInterestRate: fn(),
        setUseGlobalInterestRate: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof InterestRate>;

export const SameRateForAll: Story = {
    args: {
        interestRate: 4.0,
        useGlobalInterestRate: true,
    },
};

export const RatePerOption: Story = {
    args: {
        interestRate: 4.0,
        useGlobalInterestRate: false,
    },
};
