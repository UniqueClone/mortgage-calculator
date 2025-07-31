import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Text,
    Input,
    Label,
    makeStyles,
    tokens,
    DrawerFooter,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import React from "react";
import { MortgageFees } from "../MortgageDetails/MortgageDetails.mapper";

interface FeesPanelProps {
    fees: MortgageFees;
    setFees: React.Dispatch<React.SetStateAction<MortgageFees>>;
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles({
    drawerContent: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalL,
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS,
    },
    input: {
        width: "100%",
    },
    sectionHeader: {
        marginTop: tokens.spacingVerticalXXL,
        marginBottom: "0",
        fontWeight: "600",
        fontSize: "16px",
    },
});

export const FeesPanel: React.FC<FeesPanelProps> = (props: FeesPanelProps) => {
    const styles = useStyles();
    const { fees, setFees, isPanelOpen, setIsPanelOpen } = props;

    return (
        <Drawer
            open={isPanelOpen}
            onOpenChange={(_, { open }) => setIsPanelOpen(open)}
            position="end"
            type="overlay"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={() => setIsPanelOpen(false)}
                        />
                    }
                >
                    Mortgage Fees
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div className={styles.drawerContent}>
                    <Text>
                        These are the fees associated with taking out a mortgage on
                        a property. They are estimates and can vary depending on the
                        lender and the property.
                    </Text>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="valuation-fee">Valuation Fee</Label>
                        <Input
                            id="valuation-fee"
                            type="number"
                            className={styles.input}
                            value={fees.valuationFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    valuationFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="survey-fee">Survey Fee</Label>
                        <Input
                            id="survey-fee"
                            type="number"
                            className={styles.input}
                            value={fees.surveyFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    surveyFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                    <h2 className={styles.sectionHeader}>
                        Legal Fees and Outlays
                    </h2>

                    <Text>
                        An outlay is money spent by the solicitor on your behalf in
                        the conveyancing process e.g. land registry fees. Your legal
                        fees are your solicitor fees.
                    </Text>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="legal-fee">Legal Fees</Label>
                        <Input
                            id="legal-fee"
                            type="number"
                            className={styles.input}
                            value={fees.legalFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    legalFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="search-fee">Law Searches Fee</Label>
                        <Input
                            id="search-fee"
                            type="number"
                            className={styles.input}
                            value={fees.searchFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    searchFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="register-deeds-fee">Register of Deeds Fee</Label>
                        <Input
                            id="register-deeds-fee"
                            type="number"
                            className={styles.input}
                            value={fees.registerOfDeedsFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    registerOfDeedsFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Label htmlFor="land-registry-fee">Land Registry Fee</Label>
                        <Input
                            id="land-registry-fee"
                            type="number"
                            className={styles.input}
                            value={fees.landRegistryFee?.toString() || ""}
                            onChange={(_, data) =>
                                setFees({
                                    ...fees,
                                    landRegistryFee: parseFloat(data.value) || 0,
                                })
                            }
                            contentBefore="€"
                        />
                    </div>

                </div>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    appearance="primary"
                    onClick={() => setIsPanelOpen(false)}
                >
                    Close
                </Button>
            </DrawerFooter>
        </Drawer>
    );
};
