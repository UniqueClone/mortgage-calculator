import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Field,
    Text,
    makeStyles,
    tokens,
    DrawerFooter,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import React from "react";
import {
    MortgageFees,
    formatter,
    totalFees,
} from "../MortgageDetails/MortgageDetails.mapper";
import { NumberInput } from "../NumberInput/NumberInput";
import { defaultFees } from "../../storage";

interface FeesPanelProps {
    fees: MortgageFees;
    setFees: (fees: MortgageFees) => void;
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FeeField {
    key: keyof MortgageFees;
    label: string;
}

const purchaseFees: FeeField[] = [
    { key: "valuationFee", label: "Valuation fee" },
    { key: "surveyFee", label: "Survey fee" },
];

const legalFees: FeeField[] = [
    { key: "legalFee", label: "Legal fees" },
    { key: "searchFee", label: "Law searches fee" },
    { key: "registerOfDeedsFee", label: "Register of Deeds fee" },
    { key: "landRegistryFee", label: "Land Registry fee" },
];

const useStyles = makeStyles({
    drawerContent: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL,
        paddingBottom: tokens.spacingVerticalL,
    },
    description: {
        color: tokens.colorNeutralForeground3,
    },
    sectionHeader: {
        margin: `${tokens.spacingVerticalM} 0 0`,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
    },
    total: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: tokens.spacingVerticalM,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        fontVariantNumeric: "tabular-nums",
    },
});

export const FeesPanel: React.FC<FeesPanelProps> = (props: FeesPanelProps) => {
    const styles = useStyles();
    const { fees, setFees, isPanelOpen, setIsPanelOpen } = props;

    const renderFee = ({ key, label }: FeeField) => (
        <Field key={key} label={label}>
            <NumberInput
                value={fees[key]}
                onChange={(value) => setFees({ ...fees, [key]: value })}
                groupDigits
                contentBefore="€"
            />
        </Field>
    );

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
                    Fees
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div className={styles.drawerContent}>
                    <Text className={styles.description}>
                        Typical costs of buying with a mortgage. They're
                        estimates and vary by lender and property.
                    </Text>

                    {purchaseFees.map(renderFee)}

                    <h2 className={styles.sectionHeader}>
                        Legal fees and outlays
                    </h2>

                    <Text className={styles.description}>
                        Legal fees are your solicitor's fees. Outlays are
                        costs your solicitor pays on your behalf during
                        conveyancing, such as Land Registry fees.
                    </Text>

                    {legalFees.map(renderFee)}

                    <div className={styles.total}>
                        <Text weight="semibold">Total</Text>
                        <Text weight="semibold">
                            {formatter.format(totalFees(fees))}
                        </Text>
                    </div>
                </div>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    appearance="primary"
                    onClick={() => setIsPanelOpen(false)}
                >
                    Done
                </Button>
                <Button onClick={() => setFees(defaultFees)}>
                    Reset to defaults
                </Button>
            </DrawerFooter>
        </Drawer>
    );
};
