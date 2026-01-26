import { makePersistedStore } from "@/utils/makePersistedStore";
import { createStore } from "solid-js/store";
import { createRoot } from "solid-js";

const temporaryFilesStore = createRoot(() =>
	makePersistedStore(createStore({
		swilibVkp: "",
		sourceVkp: "",
		destinationVkp: "",
	}), { name: 'swilibTemporaryFiles', debounce: 1000 })
);

export const useTemporaryFilesStore = () => temporaryFilesStore;
