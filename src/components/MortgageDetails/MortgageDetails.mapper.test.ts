import { savingsRequired } from './MortgageDetails.mapper';

describe('MortgageDetails.mapper', () => {
    describe('savingsRequired', () => {
        it('should return 0 if savingsRequired is less than 0', () => {
            // Arrange
            const houseValue = 0;
            const deposit = -1000;
            const fees = {
                valuationFee: 0,
                surveyFee: 0,
                legalFee: 0,
                searchFee: 0,
                registerOfDeedsFee: 0,
                landRegistryFee: 0,
            };

            // Act
            const result = savingsRequired(houseValue, deposit, fees);

            // Assert
            expect(result).toBe(0);
        });

        it('should return savingsRequired if savingsRequired is greater than or equal to 0', () => {
            // Arrange
            const houseValue = 100000;
            const deposit = 20000;
            const fees = {
                valuationFee: 100,
                surveyFee: 200,
                legalFee: 300,
                searchFee: 400,
                registerOfDeedsFee: 500,
                landRegistryFee: 600,
            };

            // Act
            const result = savingsRequired(houseValue, deposit, fees);

            // Assert
            expect(result).toBe(23100);
        });
    });
});