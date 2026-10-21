# Irish Mortgage Calculator

A calculator for comparing mortgage options side by side, built around Irish lending rules and costs. It runs at [onlinemortgagecalculator.ie](https://onlinemortgagecalculator.ie).

For each option you enter a house price and loan amount, and it shows:

- the monthly repayment, and what it would be if rates rose by 1% or 2%
- the total interest and total repaid over the term
- the savings you need up front: deposit, fees and stamp duty, less any Help to Buy refund

It warns when a loan is above what the Central Bank rules or your approval would allow, and marks the option with the lowest monthly payment and the lowest upfront cost. Everything is saved in your browser, so your figures are still there when you come back.

> [!NOTE]
> The figures are estimates, not financial advice. Talk to a mortgage adviser before making a decision.

## How the figures are calculated

The rules below are as of October 2026. If any of them change, the constants live in [`MortgageDetails.mapper.ts`](src/components/MortgageDetails/MortgageDetails.mapper.ts).

### Monthly repayment

A standard repayment (annuity) mortgage with a fixed rate for the whole term:

```
payment = loan × r × (1 + r)^n / ((1 + r)^n − 1)
```

where `r` is the annual rate ÷ 12 and `n` is the term in months. At 0% the loan is simply divided by the number of months. The rate-rise figures recalculate the payment at the higher rate over the full term; in practice a rate change would apply to the remaining balance, so treat them as a rough guide.

### How much you can borrow

The maximum loan is the lowest of:

| Limit | Rule |
| --- | --- |
| Loan to value | 90% of the price, for first-time and second or subsequent buyers |
| Loan to income | 4× gross income for first-time buyers, 3.5× for second or subsequent buyers (only applied if you enter your income) |
| Your approval | The max loan from your approval in principle, if you enter one |

Lenders can lend above the loan-to-value and loan-to-income limits for a share of their customers, so you may be offered more. The calculator warns rather than blocks when a loan is over a limit.

### Stamp duty

Residential rates for purchases from 2 October 2024:

| Portion of the price | Rate |
| --- | --- |
| Up to €1,000,000 | 1% |
| €1,000,000 to €1,500,000 | 2% |
| Above €1,500,000 | 6% |

New homes are sold including 13.5% VAT, but stamp duty is charged on the price excluding VAT (price ÷ 1.135). Tick **New build** on an option to apply this.

### Help to Buy

For first-time buyers of a new build, Help to Buy is taken off the savings needed. It's the lesser of €35,000 and 10% of the price, and only applies when:

- the price is €500,000 or less
- the mortgage is at least 70% of the price

The real refund is also capped by the income tax and DIRT you paid in the four years before you apply. The calculator can't know that, so it shows the most you could get. The €35,000 maximum applies to applications from 7 October 2026 to 31 December 2029 (it was €30,000 before).

### Fees

The default fees (valuation, survey, legal fees and outlays) are typical estimates. You can change them with **Edit fees**, and they're added to the savings needed for every option.

### What isn't included

- Mortgage protection and home insurance
- Variable or changing rates: each option uses one rate for the whole term
- Cashback offers and lender fees
- Shared equity schemes such as First Home

## Running it locally

You need [Node.js](https://nodejs.org/) 20 or later.

```sh
npm install
npm run dev       # start the dev server
npm test          # run the unit tests
npm run lint      # check the code with ESLint
npm run build     # type-check and build to dist/
npm run storybook # browse components in Storybook
```

It's a [React](https://react.dev/) app built with [Vite](https://vite.dev/) and [Fluent UI](https://react.fluentui.dev/). The calculations are plain functions in [`MortgageDetails.mapper.ts`](src/components/MortgageDetails/MortgageDetails.mapper.ts), with tests alongside, and saved data is handled by [`storage.ts`](src/storage.ts).

Pushes to `main` are built and deployed to Azure by the [GitHub Actions workflow](.github/workflows/azure-webapps-node.yml).

## Feedback

Found a bug, a rule that's out of date, or have an idea? [Open an issue](https://github.com/UniqueClone/mortgage-calculator/issues/new). If the calculator helped you, you can [buy me a coffee](https://www.buymeacoffee.com/ryanlynch).

## Sources

- Central Bank of Ireland, [Mortgage Measures](https://www.centralbank.ie/financial-system/financial-stability/macro-prudential-policy/mortgage-measures) and [What are the mortgage measures?](https://www.centralbank.ie/consumer-hub/explainers/what-are-the-mortgage-measures): loan-to-value and loan-to-income limits
- Revenue, [Stamp Duty rates](https://www.revenue.ie/en/property/stamp-duty/property/stamp-duty-property/rates.aspx) and [VAT-exclusive consideration](https://www.revenue.ie/en/property/stamp-duty/consideration/vat-exclusive-consideration.aspx): stamp duty bands and new-build VAT
- Revenue, [Help to Buy: how much can you claim?](https://www.revenue.ie/en/property/help-to-buy-incentive/how-much-can-you-claim.aspx), [Who can claim HTB?](https://www.revenue.ie/en/property/help-to-buy-incentive/who-can-claim-htb.aspx) and [What is a qualifying property?](https://www.revenue.ie/en/property/help-to-buy-incentive/what-type-of-property-qualifies.aspx): Help to Buy amounts and conditions
