import { MortgageFees } from "./components/MortgageDetails/MortgageDetails.mapper";

export interface MortgageSettings {
    firstTimeBuyer: boolean;
    interestRate: number;
    useGlobalInterestRate: boolean;
    maxLoan: number;
    term: number;
    fees: MortgageFees;
}

export interface MortgageOptionState {
    id: number;
    housePrice: number;
    loanAmount: number;
    interestRate: number;
}

export interface SavedState {
    settings: MortgageSettings;
    options: MortgageOptionState[];
}

const SETTINGS_KEY = "mortgageDetails";
const OPTIONS_KEY = "mortgageOptions";
const LEGACY_OPTION_KEY_PREFIX = "mortgageOption";

export const defaultFees: MortgageFees = {
    valuationFee: 185,
    surveyFee: 600,
    legalFee: 2800,
    searchFee: 250,
    registerOfDeedsFee: 100,
    landRegistryFee: 975,
};

export const defaultSettings: MortgageSettings = {
    firstTimeBuyer: true,
    interestRate: 4.0,
    useGlobalInterestRate: true,
    maxLoan: 0,
    term: 35,
    fees: defaultFees,
};

export const newOption = (
    id: number,
    interestRate = defaultSettings.interestRate
): MortgageOptionState => ({
    id,
    housePrice: 0,
    loanAmount: 0,
    interestRate,
});

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem" | "removeItem">;

const readJson = (storage: StorageReader, key: string): unknown => {
    try {
        const raw = storage.getItem(key);
        return raw === null ? undefined : JSON.parse(raw);
    } catch {
        return undefined;
    }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const numberOr = (value: unknown, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

const booleanOr = (value: unknown, fallback: boolean) =>
    typeof value === "boolean" ? value : fallback;

const parseFees = (value: unknown): MortgageFees => {
    const saved = isRecord(value) ? value : {};
    return {
        valuationFee: numberOr(saved.valuationFee, defaultFees.valuationFee),
        surveyFee: numberOr(saved.surveyFee, defaultFees.surveyFee),
        legalFee: numberOr(saved.legalFee, defaultFees.legalFee),
        searchFee: numberOr(saved.searchFee, defaultFees.searchFee),
        registerOfDeedsFee: numberOr(
            saved.registerOfDeedsFee,
            defaultFees.registerOfDeedsFee
        ),
        landRegistryFee: numberOr(
            saved.landRegistryFee,
            defaultFees.landRegistryFee
        ),
    };
};

const parseSettings = (value: unknown): MortgageSettings => {
    const saved = isRecord(value) ? value : {};
    return {
        firstTimeBuyer: booleanOr(
            saved.firstTimeBuyer,
            defaultSettings.firstTimeBuyer
        ),
        interestRate: numberOr(saved.interestRate, defaultSettings.interestRate),
        useGlobalInterestRate: booleanOr(
            saved.useGlobalInterestRate,
            defaultSettings.useGlobalInterestRate
        ),
        maxLoan: numberOr(saved.maxLoan, defaultSettings.maxLoan),
        term: numberOr(saved.term, defaultSettings.term),
        fees: parseFees(saved.fees),
    };
};

const parseOption = (
    value: unknown,
    id: number,
    fallbackRate: number
): MortgageOptionState => {
    const saved = isRecord(value) ? value : {};
    return {
        id,
        // Older versions saved housePrice as houseValue and the per-option
        // rate as localInterestRate.
        housePrice: numberOr(saved.housePrice ?? saved.houseValue, 0),
        loanAmount: numberOr(saved.loanAmount, 0),
        interestRate: numberOr(
            saved.interestRate ?? saved.localInterestRate,
            fallbackRate
        ),
    };
};

export const loadState = (storage: StorageReader): SavedState => {
    const settings = parseSettings(readJson(storage, SETTINGS_KEY));
    const savedOptions = readJson(storage, OPTIONS_KEY);

    let options: MortgageOptionState[];
    if (Array.isArray(savedOptions) && savedOptions.length > 0) {
        options = savedOptions.map((option, index) =>
            parseOption(
                option,
                isRecord(option) ? numberOr(option.id, index + 1) : index + 1,
                settings.interestRate
            )
        );
    } else {
        options = [1, 2, 3].map((id) =>
            parseOption(
                readJson(storage, LEGACY_OPTION_KEY_PREFIX + id),
                id,
                settings.interestRate
            )
        );
    }

    return { settings, options };
};

export const saveState = (storage: StorageWriter, state: SavedState) => {
    try {
        storage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
        storage.setItem(OPTIONS_KEY, JSON.stringify(state.options));
        for (const id of [1, 2, 3]) {
            storage.removeItem(LEGACY_OPTION_KEY_PREFIX + id);
        }
    } catch {
        // Storage can be full or blocked (e.g. private browsing); the app
        // still works, it just won't remember values.
    }
};

// Reading localStorage itself can throw when site data is blocked.
export const browserStorage = (): Storage | undefined => {
    try {
        return window.localStorage;
    } catch {
        return undefined;
    }
};
