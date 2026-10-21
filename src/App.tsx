import {
    FluentProvider,
    createDarkTheme,
    createLightTheme,
    BrandVariants,
    Theme,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import "./App.css";
import { MortgageComparison } from "./components/MortgageComparison/MortgageComparison";

// A muted green, used sparingly for actions and key figures
const brand: BrandVariants = {
    10: "#081711",
    20: "#0c2219",
    30: "#113124",
    40: "#17402f",
    50: "#1c4f3a",
    60: "#215e45",
    70: "#266d50",
    80: "#2c7d5b",
    90: "#328f69",
    100: "#439d78",
    110: "#50b48a",
    120: "#6dc09d",
    130: "#8dceb3",
    140: "#addcc8",
    150: "#cdeade",
    160: "#eaf6f1",
};

const typography: Partial<Theme> = {
    fontSizeBase300: "15px",
    lineHeightBase300: "22px",
};

const lightTheme: Theme = { ...createLightTheme(brand), ...typography };

const darkTheme: Theme = {
    ...createDarkTheme(brand),
    ...typography,
    colorBrandForeground1: brand[120],
    colorBrandForegroundLink: brand[120],
    colorBrandForegroundLinkHover: brand[130],
};

const darkQuery = "(prefers-color-scheme: dark)";

const usePrefersDark = () => {
    const [prefersDark, setPrefersDark] = useState(
        () => window.matchMedia(darkQuery).matches
    );

    useEffect(() => {
        const media = window.matchMedia(darkQuery);
        const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    return prefersDark;
};

function App() {
    const prefersDark = usePrefersDark();

    return (
        <FluentProvider
            theme={prefersDark ? darkTheme : lightTheme}
            className="app-root"
        >
            <MortgageComparison />
        </FluentProvider>
    );
}

export default App;
