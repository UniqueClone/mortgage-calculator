import {
    FluentProvider,
    createDarkTheme,
    createLightTheme,
    BrandVariants,
    Theme,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
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

// Neutrals with a slight green tint so the surfaces sit with the brand colour
// instead of reading as flat grey. The page uses Background2 and cards
// Background1, so cards stand off the page in both themes.
const lightNeutrals: Partial<Theme> = {
    colorNeutralBackground1: "#ffffff",
    colorNeutralBackground1Hover: "#f4f6f4",
    colorNeutralBackground1Pressed: "#e9ece9",
    colorNeutralBackground1Selected: "#eef1ee",
    colorNeutralBackground2: "#f4f6f3",
    colorNeutralBackground3: "#eceeeb",
    colorNeutralStroke1: "#c9cfca",
    colorNeutralStroke1Hover: "#b9c0bb",
    colorNeutralStroke2: "#dfe4e0",
    colorNeutralStroke3: "#eaeeeb",
    colorNeutralForeground3: "#5b6560",
};

const darkNeutrals: Partial<Theme> = {
    colorNeutralBackground1: "#1d2320",
    colorNeutralBackground1Hover: "#29302c",
    colorNeutralBackground1Pressed: "#181d1a",
    colorNeutralBackground1Selected: "#252b28",
    colorNeutralBackground2: "#141816",
    colorNeutralBackground3: "#0f1311",
    colorNeutralStroke1: "#58625c",
    colorNeutralStroke1Hover: "#6a756f",
    colorNeutralStroke2: "#323a36",
    colorNeutralStroke3: "#29302c",
    colorNeutralForeground3: "#a7b1ab",
};

const lightTheme: Theme = {
    ...createLightTheme(brand),
    ...typography,
    ...lightNeutrals,
};

const darkTheme: Theme = {
    ...createDarkTheme(brand),
    ...typography,
    ...darkNeutrals,
    colorBrandForeground1: brand[120],
    colorBrandForegroundLink: brand[120],
    colorBrandForegroundLinkHover: brand[130],
};

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        backgroundColor: tokens.colorNeutralBackground2,
    },
});

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
    const styles = useStyles();

    return (
        <FluentProvider
            theme={prefersDark ? darkTheme : lightTheme}
            className={styles.root}
        >
            <MortgageComparison />
        </FluentProvider>
    );
}

export default App;
