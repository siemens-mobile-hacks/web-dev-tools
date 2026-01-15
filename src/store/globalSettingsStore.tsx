import { makePersistedStore } from "@/utils/makePersistedStore";
import { createStore } from "solid-js/store";
import { createRoot } from "solid-js";

export type ThemeType = "light" | "dark" | "system";

const globalSettingsStore = createRoot(() =>
	makePersistedStore(createStore({
		theme: "system" as ThemeType,
	}), { name: 'globalSettings' })
);

export const useGlobalSettingsStore = () => globalSettingsStore;
