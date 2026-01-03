import { makePersisted } from "@/utils/makePersisted";
import { createStore } from "solid-js/store";
import { createRoot } from "solid-js";

const tableOptionsStore = createRoot(() =>
	makePersisted(createStore({
		showOldNames: true,
		showEntryOffset: false,
		showOriginalSymbol: false,
		groupByFile: false,
		globalCollapsed: false,
		coverageType: 'SWI',
		groupIsCollapsed: {} as Record<string, boolean>,
		groupPrimarySort: {} as Record<string, 'ASC' | 'DESC'>,
		filterByType: 'all'
	}), { name: 'swilibTableOptions' })
);

export const useSwilibTableOptionsStore = () => tableOptionsStore;
