import { ThemeProvider, createTheme, initializeIcons } from "@fluentui/react";
import "./App.css";
import { MortgageComparison } from "./components/MortgageComparison/MortgageComparison";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
// import { appInsightsConfig } from "./AppInsightsConfig";

const reactPlugin = new ReactPlugin();
const x = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
export const appInsights = new ApplicationInsights({
  config: {
    // ...appInsightsConfig,
    connectionString: x,
    extensions: [reactPlugin],
    extensionConfig: {},
  },
});

appInsights.loadAppInsights();

function App() {
  initializeIcons();
  const myTheme = createTheme({
    palette: {
      themePrimary: "#90ee90",
      themeLighterAlt: "#060906",
      themeLighter: "#172617",
      themeLight: "#2b472b",
      themeTertiary: "#578e57",
      themeSecondary: "#7fd17f",
      themeDarkAlt: "#9bef9b",
      themeDark: "#aaf1aa",
      themeDarker: "#bff5bf",
      neutralLighterAlt: "#2d2d2d",
      neutralLighter: "#363636",
      neutralLight: "#434343",
      neutralQuaternaryAlt: "#4c4c4c",
      neutralQuaternary: "#535353",
      neutralTertiaryAlt: "#707070",
      neutralTertiary: "#c8c8c8",
      neutralSecondary: "#d0d0d0",
      neutralSecondaryAlt: "#d0d0d0",
      neutralPrimaryAlt: "#dadada",
      neutralPrimary: "#ffffff",
      neutralDark: "#f4f4f4",
      black: "#f8f8f8",
      white: "#242424",
    },
    defaultFontStyle: {
      fontSize: "18px",
    },
  });

  return (
    <ThemeProvider theme={myTheme}>
      <MortgageComparison />
    </ThemeProvider>
  );
}

export default App;
