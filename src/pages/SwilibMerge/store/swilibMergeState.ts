import { makePersistedStore } from "@/utils/makePersistedStore";
import { createStore } from "solid-js/store";
import { createRoot } from "solid-js";
import { SwilibDiffAction } from "@/api/swilib";

const swilibMergeStateStore = createRoot(() =>
	makePersistedStore(createStore({
		platform: "",
		answers: {} as Record<number, SwilibDiffAction>
	}), { name: 'swilibMergeState', debounce: 1000 })
);

export const useSwilibMergeState = () => swilibMergeStateStore;
