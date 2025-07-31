import {
  FluentProvider,
  createDarkTheme,
  BrandVariants,
} from "@fluentui/react-components";
import "./App.css";
import { MortgageComparison } from "./components/MortgageComparison/MortgageComparison";
// import { ApplicationInsights } from "@microsoft/applicationinsights-web";
// import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
// import { appInsightsConfig } from "./AppInsightsConfig";

// const reactPlugin = new ReactPlugin();

// export const appInsights = new ApplicationInsights({
//   config: {
//     ...appInsightsConfig,
//     extensions: [reactPlugin],
//     extensionConfig: {},
//   },
// });

// appInsights.loadAppInsights();

function App() {
  // Custom brand colors for an accessible green theme
  const greenBrand: BrandVariants = {
    10: "#071907", // Darkest shade - almost black with green tint
    20: "#0e2e0e", // Very dark green
    30: "#1a401a", // Dark green
    40: "#255225", // Deep green
    50: "#2f632f", // Rich forest green
    60: "#3a773a", // Medium green
    70: "#458945", // Medium-light green
    80: "#52a152", // Light green with good contrast
    90: "#60b760", // Vibrant green that's not too bright
    100: "#70c270", // Primary brand green
    110: "#84cd84", // Lighter accent green
    120: "#99d899", // Soft green
    130: "#b1e3b1", // Very light green
    140: "#c9eec9", // Pale green
    150: "#e1f6e1", // Almost white with green tint
    160: "#f5fcf5", // Whitest shade with minimal green
  };

  const customTheme = createDarkTheme(greenBrand);

  return (
    <FluentProvider theme={customTheme}>
      <MortgageComparison />
    </FluentProvider>
  );
}

export default App;
