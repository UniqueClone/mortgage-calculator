import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeesPanel, FeesPanelProps } from "./FeesPanel";

describe("FeesPanel", () => {
    const props: FeesPanelProps = {
        fees: {
            valuationFee: 0,
            surveyFee: 0,
            legalFee: 0,
            searchFee: 0,
            registerOfDeedsFee: 0,
            landRegistryFee: 0,
        },
        setFees: () => {},
        isPanelOpen: true,
        setIsPanelOpen: () => {},
    };

    it("should render FeesPanel component", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const headerText = screen.getByText("Mortgage Fees");
        expect(headerText).toBeDefined();
    });

    it("should render valuation fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const valuationFeeInput = screen.getByLabelText("Valuation Fee");
        expect(valuationFeeInput).toBeDefined();
    });

    it("should render survey fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const surveyFeeInput = screen.getByLabelText("Survey Fee");
        expect(surveyFeeInput).toBeDefined();
    });

    it("should render legal fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const legalFeeInput = screen.getByLabelText("Legal Fees");
        expect(legalFeeInput).toBeDefined();
    });

    it("should render search fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const searchFeeInput = screen.getByLabelText("Law Searches Fee");
        expect(searchFeeInput).toBeDefined();
    });

    it("should render register of deeds fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const registerOfDeedsFeeInput = screen.getByLabelText(
            "Register of Deeds Fee"
        );
        expect(registerOfDeedsFeeInput).toBeDefined();
    });

    it("should render land registry fee input", () => {
        // Act
        render(<FeesPanel {...props} />);

        // Assert
        const landRegistryFeeInput = screen.getByLabelText("Land Registry Fee");
        expect(landRegistryFeeInput).toBeDefined();
    });
});
