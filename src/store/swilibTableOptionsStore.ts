import { makePersistedStore } from "@/utils/makePersistedStore";
import { createStore } from "solid-js/store";
import { createRoot } from "solid-js";

const tableOptionsStore = createRoot(() =>
	makePersistedStore(createStore({
		showOldNames: true,
		showEntryOffset: false,
		showOriginalSymbol: false,
		groupByFile: false,
		globalCollapsed: false,
		coverageType: 'SWI',
		groupIsCollapsed: {} as Record<string, boolean>,
		groupPrimarySort: {} as Record<string, 'ASC' | 'DESC'>,
		filterByErrors: 'all',
		filterByType: 'all',
	}), { name: 'swilibTableOptions' })
);

export const useSwilibTableOptionsStore = () => tableOptionsStore;
