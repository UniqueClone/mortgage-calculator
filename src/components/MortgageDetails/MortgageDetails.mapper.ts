export interface MortgageFees {
  valuationFee: number;
  surveyFee: number;
  legalFee: number;
  stampDuty?: number;
  searchFee: number;
  registerOfDeedsFee: number;
  landRegistryFee: number;
}

export const savingsRequired = (
  houseValue: number,
  deposit: number,
  fees: MortgageFees
) => {
  return (
    deposit +
    fees.valuationFee +
    fees.surveyFee +
    fees.legalFee +
    (fees.stampDuty ?? houseValue / 100) +
    fees.searchFee +
    fees.registerOfDeedsFee +
    fees.landRegistryFee
  );
};

export const formatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export const cleanLoanAmount = (
  firstTimeBuyer: boolean,
  housePrice: number,
  loanAmount: number,
  maxLoanAmount: number | undefined
): number => {
  if (loanAmount < 0) {
    return 0;
  } else if (
    (firstTimeBuyer && loanAmount > housePrice * 0.9) ||
    (!firstTimeBuyer && loanAmount > housePrice * 0.8)
  ) {
    if (firstTimeBuyer) {
      return cleanLoanAmount(true, housePrice, housePrice * 0.9, maxLoanAmount);
    } else {
      return cleanLoanAmount(
        false,
        housePrice,
        housePrice * 0.8,
        maxLoanAmount
      );
    }
  } else if (maxLoanAmount && loanAmount > maxLoanAmount) {
    return maxLoanAmount;
  } else {
    return parseFloat(loanAmount.toFixed(2));
  }
};

export const getMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number
) => {
  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
    return 0;
  }

  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const numerator =
    loanAmount *
    monthlyInterestRate *
    (1 + monthlyInterestRate) ** numberOfPayments;
  const denominator = (1 + monthlyInterestRate) ** numberOfPayments - 1;
  return parseFloat((numerator / denominator).toFixed(2));
};

export const setLoanAmountToMax = (
  firstTimeBuyer: boolean,
  houseValue: number,
  maxLoanAmount: number,
  setLoanAmount: (newValue: number) => void
) => {
  if (
    // if first time buyer and max loan amount is greater than 90% of house value and max loan amount is set
    firstTimeBuyer &&
    houseValue * 0.9 > maxLoanAmount &&
    maxLoanAmount > 0
  ) {
    setLoanAmount(maxLoanAmount);
    console.log("if, maxLoanAmount", maxLoanAmount);
  } else if (
    // if not first time buyer and max loan amount is greater than 80% of house value and max loan amount is set
    !firstTimeBuyer &&
    houseValue * 0.8 > maxLoanAmount &&
    maxLoanAmount > 0
  ) {
    setLoanAmount(maxLoanAmount);
    console.log("else if, maxLoanAmount", maxLoanAmount);
  } else {
    // if first time buyer set loan amount to 90% of house value, otherwise set to 80% of house value
    firstTimeBuyer
      ? setLoanAmount(houseValue * 0.9)
      : setLoanAmount(houseValue * 0.8);
    console.log(
      "else, houseValue",
      houseValue,
      "firstTimeBuyer",
      firstTimeBuyer,
      "maxLoanAmount",
      maxLoanAmount
    );
  }
};
