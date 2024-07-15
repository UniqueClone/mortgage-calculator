import { Panel, PrimaryButton, Stack, Text, TextField } from "@fluentui/react";
import React from "react";
import { MortgageFees } from "../MortgageDetails/MortgageDetails.mapper";

interface FeesPanelProps {
    fees: MortgageFees;
    setFees: React.Dispatch<React.SetStateAction<MortgageFees>>;
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FeesPanel: React.FC<FeesPanelProps> = (props: FeesPanelProps) => {
    const { fees, setFees, isPanelOpen, setIsPanelOpen } = props;

    return (
        <Panel
            isOpen={isPanelOpen}
            onDismiss={() => setIsPanelOpen(false)}
            headerText="Mortgage Fees"
            onRenderFooterContent={() => (
                <PrimaryButton
                    onClick={() => {
                        setIsPanelOpen(false);
                    }}
                >
                    Close
                </PrimaryButton>
            )}
        >
            <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="medium">
                    These are the fees associated with taking out a mortgage on
                    a property. They are estimates and can vary depending on the
                    lender and the property.
                </Text>

                <TextField
                    label="Valuation Fee"
                    prefix="€"
                    type="number"
                    value={fees.valuationFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            valuationFee: parseFloat(newValue!),
                        })
                    }
                />

                <TextField
                    label="Survey Fee"
                    prefix="€"
                    type="number"
                    value={fees.surveyFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            surveyFee: parseFloat(newValue!),
                        })
                    }
                />

                <TextField
                    label="Legal Fee"
                    prefix="€"
                    type="number"
                    value={fees.legalFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            legalFee: parseFloat(newValue!),
                        })
                    }
                />

                <TextField
                    label="Search Fee"
                    prefix="€"
                    type="number"
                    value={fees.searchFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            searchFee: parseFloat(newValue!),
                        })
                    }
                />

                <TextField
                    label="Register of Deeds Fee"
                    prefix="€"
                    type="number"
                    value={fees.registerOfDeedsFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            registerOfDeedsFee: parseFloat(newValue!),
                        })
                    }
                />

                <TextField
                    label="Land Registry Fee"
                    prefix="€"
                    type="number"
                    value={fees.landRegistryFee.toString()}
                    onChange={(_, newValue) =>
                        setFees({
                            ...fees,
                            landRegistryFee: parseFloat(newValue!),
                        })
                    }
                />

                <br />

                {/* <PrimaryButton
                        onClick={() => {
                            setIsPanelOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButton> */}
            </Stack>
        </Panel>
    );
};
